import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { clearLine, cursorTo } from 'readline';
import { SubmissionHelper } from '../helpers';
import http from '../http/http.client';
import { getOnLog, JudgeLogger } from '../logger';
import { Judging } from '../models';
import { DockerService, ExecResult, SocketService } from '../services';
import { startSpinner, stopSpinner } from '../utils';

/**
 * The Compiler assure the compilation of the submission and checker code source files.
 */
@Injectable()
export class Compiler {
  private readonly logger: JudgeLogger;

  constructor(
    private readonly dockerService: DockerService,
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper,
  ) {
    this.logger = new JudgeLogger(Compiler.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    const {
      problem: { checkScript },
    } = submission;
    this.logger.log(
      `Compiling submission file ${submission.file.name}\t`,
      undefined,
      false,
    );
    const spinner = startSpinner();
    // Create docker container to compile the submission file
    const submissionCompilerContainer =
      await this.dockerService.createContainer({
        Image: submission.language.dockerImage,
        name: this.submissionHelper.compileContainerName(),
      });
    // Start the submission compiler container
    await submissionCompilerContainer.start();
    // Make the language build script executable
    await fs.chmod(this.submissionHelper.languageFilePath(), '0775');
    // Executing the compile command inside the submission compile container
    const submissionCompileResult = await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      this.submissionHelper.compileCmd(),
    );
    // Compile the guard code inside the language container to assure the compatibility with the linux kernel
    await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      'g++ --std=c++11 -pthread -o guard guard.cpp'.split(' '),
      this.submissionHelper.assetsDir(),
    );
    // Report the result of the submission file compilation
    await this.updateJudging(judging, submissionCompileResult);
    await this.dockerService.pruneContainer(submissionCompilerContainer);
    stopSpinner(spinner);
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    if (!submissionCompileResult.exitCode) {
      this.logger.log(`Compiling submission file ${submission.file.name}\tOK!`);
    } else {
      this.logger.error(
        `Compiling submission file ${submission.file.name}\tNOT OK!`,
      );
      return;
    }

    // Check if we already built the check script or not to prevent the double work
    if (
      !existsSync(
        this.submissionHelper.executableBinPath(
          checkScript.id,
          checkScript.file,
        ),
      )
    ) {
      this.logger.log(
        `Compiling executable file ${checkScript.file.name}\t`,
        undefined,
        false,
      );
      const spinner = startSpinner();
      // Create docker container to compile the checker file
      const checkerContainer = await this.dockerService.createContainer({
        Image: submission.problem.checkScript.dockerImage,
        name: this.submissionHelper.compileCheckerContainerName(),
        WorkingDir: this.submissionHelper.executableFileDir(
          checkScript.id,
          checkScript.file,
        ),
      });
      // Start the checker compiler container
      await checkerContainer.start();
      // Make the checker build script executable
      await fs.chmod(
        this.submissionHelper.executableFilePath(
          checkScript.id,
          checkScript.buildScript,
        ),
        '0775',
      );
      // Copy the testlib.h to the compiling directory to support the Codeforces checkers
      await fs.copyFile(
        this.submissionHelper.testLibPath,
        join(
          this.submissionHelper.executableFileDir(
            checkScript.id,
            checkScript.file,
          ),
          'testlib.h',
        ),
      );
      // Executing the compile command inside the checker compile container
      const checkerCompileResult = await this.dockerService.execCmdInDocker(
        checkerContainer,
        this.submissionHelper.checkerCompileCmd(),
      );
      await this.dockerService.pruneContainer(checkerContainer);

      stopSpinner(spinner);
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      if (!checkerCompileResult.exitCode) {
        this.logger.log(
          `Compiling executable file ${checkScript.file.name}\tOK!`,
        );
      } else {
        this.logger.error(
          `Compiling executable file ${submission.file.name}\tNOT OK!`,
        );
        return;
      }
    }
    this.logger.log(`Submission with id ${submission.id} compiled!`);
  }

  private async updateJudging(
    judging: Judging,
    submissionCompileResult: ExecResult,
  ): Promise<void> {
    const {
      submission: {
        judgeHost: { hostname },
      },
    } = judging;
    const payload = Buffer.from(submissionCompileResult.stdout.trim()).toString(
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
}
