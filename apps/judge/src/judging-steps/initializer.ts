import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

import { SubmissionHelper, downloadFile } from '../helpers';
import { JudgeLogger, getOnLog } from '../logger';
import { Executable, Judging, Language, Problem, Submission } from '../models';
import { DockerService, SocketService } from '../services';

/**
 * The Initializer assure the fetching and the creation of all files needed
 * to run the submission such as:
 *  - submission code source
 *  - problem testcases files
 *  - language build script
 *  - checker build script and code source
 * and also it pulls the docker images needed for the submission.
 */
@Injectable()
export class Initializer {
  private readonly logger: JudgeLogger;

  constructor(
    private readonly dockerService: DockerService,
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper,
  ) {
    this.logger = new JudgeLogger(Initializer.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    // Write the submission file
    await this.writeSubmissionFile(submission);
    // Fetch and write the problem testcases files only if they don't exists
    await this.writeProblemTestcases(submission.problem.problem);
    // Write the problem executables files
    await this.writeProblemExecutables(submission.problem.problem);
    // Write the language build script file
    await this.writeLanguageBuildScript(submission.language);
    // Pull the docker image needed to run the submission
    await this.dockerService.pullImage(submission.language.dockerImage);
    // Pull the docker image needed to run the checker script
    await this.dockerService.pullImage(submission.problem.problem.checkScript.dockerImage);
  }

  private async writeSubmissionFile(submission: Submission): Promise<void> {
    await downloadFile(submission.sourceFileName, this.submissionHelper.filePath());
    this.logger.debug(`Submission File ${submission.sourceFileName} written!`);
  }

  private async writeProblemTestcases(problem: Problem): Promise<void> {
    for (const testcase of problem.testcases) {
      for (const type of ['inputFile', 'outputFile'] as const) {
        const filePath = this.submissionHelper.testcaseFilePath(testcase.id, testcase[type]);

        if (!existsSync(filePath)) {
          await downloadFile(testcase[type].name, filePath);
          this.logger.debug(`Testcase file ${testcase[type].name} written!`);
        }
      }
    }
  }

  private async writeProblemExecutables(problem: Problem): Promise<void> {
    await Promise.all([
      this.writeExecutable(problem.runScript),
      this.writeExecutable(problem.checkScript),
      this.dockerService.pullImage(problem.checkScript.dockerImage),
    ]);
  }

  private async writeExecutable(executable: Executable): Promise<void> {
    for (const file of ['sourceFile', 'buildScript'] as const) {
      if (!executable[file]) continue;

      const filePath = this.submissionHelper.executableFilePath(executable.id, executable[file]);

      if (!existsSync(filePath)) {
        await downloadFile(executable[file].name, filePath);
        this.logger.debug(`Executable file ${executable[file].name} written!`);
      }
    }
  }

  private async writeLanguageBuildScript(language: Language): Promise<void> {
    const filePath = this.submissionHelper.languageFilePath();

    if (!existsSync(filePath)) {
      await downloadFile(language.buildScript.name, filePath);
      this.logger.debug(`Language file ${language.buildScript.name} written!`);
    }
  }
}
