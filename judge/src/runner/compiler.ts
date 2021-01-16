import { AbstractRunnerStep } from './runner-step';
import { Judging } from '../models';
import { chmodSync, existsSync, promises } from 'fs';
import { join } from 'path';
import { MD5 } from 'crypto-js';
import sh, { testLibPath } from './submission-helper';
import dockerService from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import http from '../http/http.client';

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
    const submissionContainer = await dockerService.createContainer({
      Image: submission.language.dockerImage,
      name: sh.containerBuildName(),
    });
    await submissionContainer.start();
    chmodSync(sh.languageFilePath(), '0775');
    const submissionCompileResult = await dockerService.execCmdInDocker(
      submissionContainer,
      sh.compileCmd(),
    );
    await dockerService.pruneContainer(submissionContainer);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    const payload = Buffer.from(submissionCompileResult.stdout).toString(
      'base64',
    );
    const compileOutputFile = {
      name: 'compile.out',
      type: 'text/plain',
      size: submissionCompileResult.stdout.length,
      md5Sum: MD5(payload).toString(),
      content: {
        payload: payload,
      },
    };
    if (!submissionCompileResult.exitCode) {
      await http.put(
        `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
        {
          id: judging.id,
          compileOutput: compileOutputFile,
        } as Partial<Judging>,
      );
      logger.log(`Compiling submission file ${submission.file.name}...\tOK!`);
    } else {
      await http.put(
        `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
        {
          id: judging.id,
          endTime: new Date(),
          result: 'compile-error',
          compileOutput: compileOutputFile,
        } as Partial<Judging>,
      );
      logger.error(
        `Compiling submission file ${submission.file.name}...\tNOT OK!`,
      );
      return;
    }

    if (!existsSync(sh.executableBinPath(checkScript.id, checkScript.file))) {
      logger.log(
        `Compiling executable file ${checkScript.file.name}...`,
        undefined,
        false,
      );
      const checkerContainer = await dockerService.createContainer({
        Image: submission.problem.checkScript.dockerImage,
        name: sh.checkerBuildName(),
        WorkingDir: sh.executableFileDir(
          checkScript.id,
          checkScript.file,
          true,
        ),
      });
      await checkerContainer.start();
      chmodSync(
        sh.executableFilePath(checkScript.id, checkScript.buildScript),
        '0775',
      );
      await promises.copyFile(
        testLibPath,
        join(
          sh.executableFileDir(checkScript.id, checkScript.file),
          'testlib.h',
        ),
      );
      const checkerCompileResult = await dockerService.execCmdInDocker(
        checkerContainer,
        sh.checkerCompileCmd(),
      );
      await dockerService.pruneContainer(checkerContainer);

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
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
