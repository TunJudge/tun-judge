import { existsSync, writeFileSync } from 'fs';
import { AbstractRunnerStep } from './runner-step';
import {
  Executable,
  FileContent,
  Language,
  Problem,
  Submission,
} from '../models';
import http from '../http/http.client';
import dockerService from '../services/docker.service';
import { Logger } from '@nestjs/common';
import sh from './submission-helper';

export class Initializer extends AbstractRunnerStep {
  constructor() {
    super();
  }

  async run(submission: Submission): Promise<void> {
    await Promise.all([
      writeSubmissionFile(submission),
      writeProblemTestcases(submission.problem),
      writeProblemExecutables(submission.problem),
      writeLanguageBuildScript(submission.language),
      dockerService.pullImage(submission.language.dockerImage),
    ]);
    logger.log(`[Submission] Submission with id ${submission.id} initialized!`);
    await super.run(submission);
  }
}

const logger = new Logger(Initializer.name);

async function writeSubmissionFile(submission: Submission): Promise<void> {
  writeFileSync(sh.filePath(), submission.file.content.payload, 'base64');
  logger.log(`[Submission] File ${submission.file.name} written!`);
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
        logger.log(`[Testcase] File ${testcase[type].name} written!`);
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
      logger.log(`[Executable] File ${executable[file].name} written!`);
    }
  }
}

async function writeLanguageBuildScript(language: Language): Promise<void> {
  const filePath = sh.languageFilePath();
  if (!existsSync(filePath)) {
    writeFileSync(filePath, language.buildScript.content.payload, 'base64');
    logger.log(`[Language] File ${language.buildScript.name} written!`);
  }
}
