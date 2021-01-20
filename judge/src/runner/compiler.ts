import { existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { clearLine, cursorTo } from 'readline';
import { MD5 } from 'crypto-js';

import { AbstractRunnerStep } from './runner-step';
import { Judging } from '../models';
import sh, { testLibPath } from './submission-helper';
import dockerService, { ExecResult } from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import http from '../http/http.client';

/**
 * The Compiler assure the compilation of the submission and checker code source files.
 */
export class Compiler extends AbstractRunnerStep {
  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    const {
      problem: { checkScript },
    } = submission;
    logger.log(
      `Compiling submission file ${submission.file.name}...`,
      undefined,
      false,
    );
    // Create docker container to compile the submission file
    const submissionCompilerContainer = await dockerService.createContainer({
      Image: submission.language.dockerImage,
      name: sh.compileContainerName(),
    });
    // Start the submission compiler container
    await submissionCompilerContainer.start();
    // Make the language build script executable
    await fs.chmod(sh.languageFilePath(), '0775');
    // Executing the compile command inside the submission compile container
    const submissionCompileResult = await dockerService.execCmdInDocker(
      submissionCompilerContainer,
      sh.compileCmd(),
    );
    // Compile the guard code inside the language container to assure the compatibility with the linux kernel
    await dockerService.execCmdInDocker(
      submissionCompilerContainer,
      'g++ --std=c++11 -pthread -o guard guard.cpp'.split(' '),
      sh.assetsDir(true),
    );
    // Report the result of the submission file compilation
    await updateJudging(judging, submissionCompileResult);
    await dockerService.pruneContainer(submissionCompilerContainer);
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    if (!submissionCompileResult.exitCode) {
      logger.log(`Compiling submission file ${submission.file.name}...\tOK!`);
    } else {
      logger.error(
        `Compiling submission file ${submission.file.name}...\tNOT OK!`,
      );
      return;
    }

    // Check if we already built the check script or not to prevent the double work
    if (!existsSync(sh.executableBinPath(checkScript.id, checkScript.file))) {
      logger.log(
        `Compiling executable file ${checkScript.file.name}...`,
        undefined,
        false,
      );
      // Create docker container to compile the checker file
      const checkerContainer = await dockerService.createContainer({
        Image: submission.problem.checkScript.dockerImage,
        name: sh.compileCheckerContainerName(),
        WorkingDir: sh.executableFileDir(
          checkScript.id,
          checkScript.file,
          true,
        ),
      });
      // Start the checker compiler container
      await checkerContainer.start();
      // Make the checker build script executable
      await fs.chmod(
        sh.executableFilePath(checkScript.id, checkScript.buildScript),
        '0775',
      );
      // Copy the testlib.h to the compiling directory to support the Codeforces checkers
      await fs.copyFile(
        testLibPath,
        join(
          sh.executableFileDir(checkScript.id, checkScript.file),
          'testlib.h',
        ),
      );
      // Executing the compile command inside the checker compile container
      const checkerCompileResult = await dockerService.execCmdInDocker(
        checkerContainer,
        sh.checkerCompileCmd(),
      );
      await dockerService.pruneContainer(checkerContainer);

      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      if (!checkerCompileResult.exitCode) {
        logger.log(
          `Compiling executable file ${checkScript.file.name}...\tOK!`,
        );
      } else {
        logger.error(
          `Compiling executable file ${submission.file.name}...\tNOT OK!`,
        );
        return;
      }
    }
    logger.log(`Submission with id ${submission.id} compiled!`);
    await super.run(judging);
  }
}

const logger = new JudgeLogger(Compiler.name);

async function updateJudging(
  judging: Judging,
  submissionCompileResult: ExecResult,
): Promise<void> {
  const {
    submission: {
      judgeHost: { hostname },
    },
  } = judging;
  const payload = Buffer.from(submissionCompileResult.stdout).toString(
    'base64',
  );
  judging.compileOutput = {
    id: undefined,
    name: 'compile.out',
    type: 'text/plain',
    size: submissionCompileResult.stdout.length,
    md5Sum: MD5(payload).toString(),
    content: {
      id: undefined,
      payload: payload,
    },
  };
  if (submissionCompileResult.exitCode) {
    judging.endTime = new Date();
    judging.result = 'CE';
  }
  await http.put(
    `api/judge-hosts/${hostname}/update-judging/${judging.id}`,
    judging,
  );
}
