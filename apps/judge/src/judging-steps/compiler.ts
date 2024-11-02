import { Injectable } from '@nestjs/common';
import { existsSync, promises as fs } from 'fs';
import { join } from 'path';

import { FileKind } from '@prisma/client';

import { Spinner, SubmissionHelper } from '../helpers';
import { uploadFile } from '../helpers/upload-file';
import { JudgeLogger, getOnLog } from '../logger';
import { Executable, Judging } from '../models';
import { DockerService, ExecResult, SocketService, SystemService } from '../services';
import { prisma } from '../services/prisma.service';

/**
 * The Compiler assure the compilation of the submission and checker code source files.
 */
@Injectable()
export class Compiler {
  private readonly logger: JudgeLogger;

  constructor(
    private readonly dockerService: DockerService,
    private readonly socketService: SocketService,
    private readonly systemService: SystemService,
    private readonly submissionHelper: SubmissionHelper,
  ) {
    this.logger = new JudgeLogger(Compiler.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<boolean> {
    const { submission } = judging;
    const {
      problem: { checkScript },
    } = submission.problem;

    const compileSubmissionResult = await this.compileSubmissionFile(judging);

    if (compileSubmissionResult.exitCode) {
      this.logger.error(`Compiling submission file ${submission.sourceFileName}\tNOT OK!`);
      await this.systemService.setJudgingResult(judging, 'COMPILATION_ERROR');
      return false;
    }
    this.logger.log(`Compiling submission file ${submission.sourceFileName}\tOK!`);

    const compileCheckerResult = await this.compileCheckerFile(checkScript);

    if (compileCheckerResult) {
      if (compileCheckerResult.exitCode) {
        this.logger.error(`Compiling executable file ${checkScript.sourceFileName}\tNOT OK!`);
        await this.systemService.setJudgingResult(
          judging,
          'SYSTEM_ERROR',
          compileCheckerResult.stdout,
        );
        return false;
      }
      this.logger.log(`Compiling executable file ${checkScript.sourceFileName}\tOK!`);
    }

    this.logger.log(`Submission with id ${submission.id} compiled!`);
    return true;
  }

  private async compileSubmissionFile(judging: Judging) {
    const {
      submission: { id, sourceFileName, language },
    } = judging;

    this.logger.log(`Compiling submission file ${sourceFileName}\t`, undefined, false);
    const spinner = new Spinner();

    // Create docker container to compile the submission file
    const submissionCompilerContainer = await this.dockerService.createContainer({
      Image: language.dockerImage,
      name: `tun-judge-build-submission-${id}-${Date.now()}`,
    });

    // Start the submission compiler container
    await submissionCompilerContainer.start();

    // Make the language build script executable
    await fs.chmod(this.submissionHelper.languageFilePath(), '0775');

    // Executing the compile command inside the submission compile container
    const compileSubmissionResult = await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      this.submissionHelper.compileCmd(),
    );

    // Compile the guard code inside the language container to assure the compatibility with the linux kernel
    await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      ['g++', '--std=c++11', '-pthread', '-o', 'guard', 'guard.cpp'],
      this.submissionHelper.assetsDir(),
    );

    // Report the result of the submission file compilation
    await this.setJudgingCompileOutput(judging, compileSubmissionResult);

    await this.dockerService.pruneContainer(submissionCompilerContainer);

    spinner.stop();

    return compileSubmissionResult;
  }

  private async compileCheckerFile(checkScript: Executable): Promise<ExecResult | undefined> {
    // Check if we already built the check script or not to prevent the double work
    const checkerBinPath = this.submissionHelper.executableBinPath(
      checkScript.id,
      checkScript.sourceFile,
    );
    if (existsSync(checkerBinPath)) return undefined;

    this.logger.log(`Compiling executable file ${checkScript.sourceFileName}\t`, undefined, false);
    const spinner = new Spinner();

    // Create docker container to compile the checker file
    const checkerContainer = await this.dockerService.createContainer({
      Image: checkScript.dockerImage,
      name: `tun-judge-build-checker-${checkScript.id}-${Date.now()}`,
      WorkingDir: this.submissionHelper.executableFileDir(checkScript.id, checkScript.sourceFile),
    });

    // Start the checker compiler container
    await checkerContainer.start();

    // Make the checker build script executable
    await fs.chmod(
      this.submissionHelper.executableFilePath(checkScript.id, checkScript.buildScript),
      '0775',
    );

    // Copy the testlib.h to the compiling directory to support the Codeforces checkers
    await fs.copyFile(
      this.submissionHelper.testLibPath,
      join(
        this.submissionHelper.executableFileDir(checkScript.id, checkScript.sourceFile),
        'testlib.h',
      ),
    );

    // Executing the compile command inside the checker compile container
    const compileCheckerResult = await this.dockerService.execCmdInDocker(
      checkerContainer,
      this.submissionHelper.checkerCompileCmd(),
    );

    await this.dockerService.pruneContainer(checkerContainer);

    spinner.stop();

    return compileCheckerResult;
  }

  private async setJudgingCompileOutput(judging: Judging, result: ExecResult): Promise<void> {
    const parentDirectoryName = `Submissions/${judging.submission.team.name}/${judging.submission.id}/Judgings/${judging.id}`;

    const blob = new Blob([result.stdout.trim()], { type: 'text/plain' });
    const file = new File([blob], 'compile.out', { type: 'text/plain' });
    const compileOutput = await uploadFile(file, {
      name: `${parentDirectoryName}/${file.name}`,
      type: file.type,
      size: file.size,
      md5Sum: '',
      kind: FileKind.FILE,
      parentDirectoryName,
    });

    await prisma.judging.update({
      where: { id: judging.id },
      data: { compileOutputFileName: compileOutput.name },
      include: { submission: true },
    });
  }
}
