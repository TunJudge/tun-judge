import { Injectable } from '@nestjs/common';
import { existsSync, writeFileSync } from 'fs';
import { SubmissionHelper } from '../helpers';
import { getOnLog, JudgeLogger } from '../logger';
import { Executable, Judging, Language, Problem, Submission } from '../models';
import { DockerService, SocketService, SystemService } from '../services';

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
    private readonly systemService: SystemService,
    private readonly submissionHelper: SubmissionHelper,
  ) {
    this.logger = new JudgeLogger(Initializer.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    // Write the submission file
    await this.writeSubmissionFile(submission);
    // Fetch and write the problem testcases files only if they don't exists
    await this.writeProblemTestcases(submission.problem);
    // Write the problem executables files
    await this.writeProblemExecutables(submission.problem);
    // Write the language build script file
    await this.writeLanguageBuildScript(submission.language);
    // Pull the docker image needed to run the submission
    await this.dockerService.pullImage(submission.language.dockerImage);
    // Pull the docker image needed to run the checker script
    await this.dockerService.pullImage(submission.problem.checkScript.dockerImage);
  }

  private async writeSubmissionFile(submission: Submission): Promise<void> {
    writeFileSync(this.submissionHelper.filePath(), submission.file.content.payload, 'base64');
    this.logger.debug(`Submission File ${submission.file.name} written!`);
  }

  private async writeProblemTestcases(problem: Problem): Promise<void> {
    for (const testcase of problem.testcases) {
      for (const type of ['input', 'output'] as const) {
        const filePath = this.submissionHelper.testcaseFilePath(testcase.id, testcase[type]);

        if (!existsSync(filePath)) {
          testcase[type].content = await this.systemService.getTestcaseFileContent(
            testcase.id,
            type,
          );
          writeFileSync(filePath, testcase[type].content.payload, 'base64');
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
    for (const file of ['file', 'buildScript'] as const) {
      if (!executable[file]) continue;

      const filePath = this.submissionHelper.executableFilePath(executable.id, executable[file]);

      if (!existsSync(filePath)) {
        writeFileSync(filePath, executable[file].content.payload, 'base64');
        this.logger.debug(`Executable file ${executable[file].name} written!`);
      }
    }
  }

  private async writeLanguageBuildScript(language: Language): Promise<void> {
    const filePath = this.submissionHelper.languageFilePath();

    if (!existsSync(filePath)) {
      writeFileSync(filePath, language.buildScript.content.payload, 'base64');
      this.logger.debug(`Language file ${language.buildScript.name} written!`);
    }
  }
}
