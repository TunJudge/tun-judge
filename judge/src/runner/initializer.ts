import { existsSync, writeFileSync } from 'fs';
import http from '../http/http.client';
import {
  Executable,
  FileContent,
  Judging,
  Language,
  Problem,
  Submission,
} from '../models';
import dockerService from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import { AbstractRunnerStep } from './runner-step';
import sh from './submission-helper';

/**
 * The Initializer assure the fetching and the creation of all files needed
 * to run the submission such as:
 *  - submission code source
 *  - problem testcases files
 *  - language build script
 *  - checker build script and code source
 * and also it pulls the docker images needed for the submission.
 */
export class Initializer extends AbstractRunnerStep {
  constructor() {
    super();
  }

  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    try {
      // Write the submission file
      await writeSubmissionFile(submission);
      // Fetch and write the problem testcases files only if they don't exists
      await writeProblemTestcases(submission.problem);
      // Write the problem executables files
      await writeProblemExecutables(submission.problem);
      // Write the language build script file
      await writeLanguageBuildScript(submission.language);
      // Pull the docker image needed to run the submission
      await dockerService.pullImage(submission.language.dockerImage);
      // Pull the docker image needed to run the checker script
      await dockerService.pullImage(submission.problem.checkScript.dockerImage);
    } catch (e) {
      return;
    }
    await super.run(judging);
  }
}

const logger = new JudgeLogger(Initializer.name);

async function writeSubmissionFile(submission: Submission): Promise<void> {
  writeFileSync(sh.filePath(), submission.file.content.payload, 'base64');
  logger.debug(`Submission File ${submission.file.name} written!`);
}

async function writeProblemTestcases(problem: Problem): Promise<void> {
  for (const testcase of problem.testcases) {
    for (const type of ['input', 'output']) {
      const filePath = sh.testcaseFilePath(testcase.id, testcase[type]);
      if (!existsSync(filePath)) {
        testcase[type].content = await http.get<FileContent>(
          `api/testcases/${testcase.id}/content/${type}`,
        );
        writeFileSync(filePath, testcase[type].content.payload, 'base64');
        logger.debug(`Testcase file ${testcase[type].name} written!`);
      }
    }
  }
}

async function writeProblemExecutables(problem: Problem): Promise<void> {
  await Promise.all([
    writeExecutable(problem.runScript),
    writeExecutable(problem.checkScript),
    dockerService.pullImage(problem.checkScript.dockerImage),
  ]);
}

async function writeExecutable(executable: Executable): Promise<void> {
  for (const file of ['file', 'buildScript']) {
    if (!executable[file]) continue;
    const filePath = sh.executableFilePath(executable.id, executable[file]);
    if (!existsSync(filePath)) {
      writeFileSync(filePath, executable[file].content.payload, 'base64');
      logger.debug(`Executable file ${executable[file].name} written!`);
    }
  }
}

async function writeLanguageBuildScript(language: Language): Promise<void> {
  const filePath = sh.languageFilePath();
  if (!existsSync(filePath)) {
    writeFileSync(filePath, language.buildScript.content.payload, 'base64');
    logger.debug(`Language file ${language.buildScript.name} written!`);
  }
}
