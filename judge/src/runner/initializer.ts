import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { AbstractRunnerStep } from './runner-step';
import { FileContent, Language, Problem, Submission } from '../models';
import http from '../http/http.client';
import dockerService from '../services/docker.service';
import { Logger } from '@nestjs/common';

const workDirPath = join(__dirname, '..', '..', 'workDir');

export class Initializer extends AbstractRunnerStep {
  constructor() {
    super();
    mkdirSync(workDirPath, { recursive: true });
  }

  async run(submission: Submission): Promise<string> {
    await Promise.all([
      writeSubmissionFile(submission),
      writeProblemTestcases(submission.problem),
      writeLanguageBuildScript(submission.language),
      dockerService.pullImage(submission.language.dockerImage),
    ]);
    logger.log(`[Submission] Submission with id ${submission.id} initialized!`);
    return await super.run(submission);
  }
}

const logger = new Logger(Initializer.name);

async function writeSubmissionFile(submission: Submission): Promise<void> {
  const submissionPath = join(
    workDirPath,
    'submissions',
    String(submission.id),
  );
  const filePath = join(submissionPath, submission.file.name);
  mkdirSync(submissionPath, { recursive: true });
  writeFileSync(filePath, submission.file.content.payload, 'base64');
  logger.log(`[Submission] File ${submission.file.name} written!`);
}

async function writeProblemTestcases(problem: Problem): Promise<void> {
  const problemPath = join(workDirPath, 'problems', String(problem.id));
  for (const testcase of problem.testcases) {
    const testcasePath = join(problemPath, 'testcases', String(testcase.id));
    mkdirSync(testcasePath, { recursive: true });
    for (const type of ['input', 'output']) {
      const fileDirPath = join(testcasePath, testcase[type].md5Sum);
      const filePath = join(fileDirPath, testcase[type].name);
      if (!existsSync(filePath)) {
        mkdirSync(fileDirPath, { recursive: true });
        testcase[type].content = await http.get<FileContent>(
          `api/testcases/${testcase.id}/content/${type}`,
        );
        writeFileSync(filePath, testcase[type].content.payload, 'base64');
        logger.log(`[Testcase] File ${testcase[type].name} written!`);
      }
    }
  }
}

async function writeLanguageBuildScript(language: Language): Promise<void> {
  const languagePath = join(workDirPath, 'languages', String(language.id));
  const fileDirPath = join(languagePath, language.buildScript.md5Sum);
  const filePath = join(fileDirPath, language.buildScript.name);
  if (!existsSync(filePath)) {
    mkdirSync(fileDirPath, { recursive: true });
    writeFileSync(filePath, language.buildScript.content.payload, 'base64');
    logger.log(`[Language] File ${language.buildScript.name} written!`);
  }
}
