import { Logger } from '@nestjs/common';
import { AbstractRunnerStep } from './runner-step';
import { Submission } from '../models';
import { chmodSync, existsSync, promises } from 'fs';
import { join } from 'path';
import sh, { dockerWorkDir, testLibPath, workDir } from './submission-helper';
import dockerService from '../services/docker.service';

export class Compiler extends AbstractRunnerStep {
  async run(submission: Submission): Promise<void> {
    await Promise.all([
      compileSubmission(submission),
      compileChecker(submission),
    ]);
    logger.log(`[Submission] Submission with id ${submission.id} compiled!`);
    await super.run(submission);
  }
}

const logger = new Logger(Compiler.name);

async function compileSubmission(submission: Submission): Promise<void> {
  chmodSync(sh.languageFilePath(), '0775');
  const container = await dockerService.createContainer({
    Image: submission.language.dockerImage,
    name: sh.containerBuildName(),
    // OpenStdin: true,
    Cmd: sh.compileCmd(),
    WorkingDir: sh.submissionDir(true),
    HostConfig: {
      Mounts: [
        {
          Target: dockerWorkDir,
          Source: workDir,
          Type: 'bind',
        },
      ],
    },
  });
  await container.start();
  await container.wait();
  await container.remove();
}

async function compileChecker(submission: Submission): Promise<void> {
  const {
    problem: { checkScript },
  } = submission;

  if (existsSync(sh.executableBinPath(checkScript.id, checkScript.file)))
    return;

  chmodSync(
    sh.executableFilePath(checkScript.id, checkScript.buildScript),
    '0775',
  );
  await promises.copyFile(
    testLibPath,
    join(sh.executableFileDir(checkScript.id, checkScript.file), 'testlib.h'),
  );
  const container = await dockerService.createContainer({
    Image: submission.problem.checkScript.dockerImage,
    name: sh.checkerBuildName(),
    Cmd: sh.checkerCompileCmd(),
    WorkingDir: sh.executableFileDir(checkScript.id, checkScript.file, true),
    HostConfig: {
      Mounts: [
        {
          Target: dockerWorkDir,
          Source: workDir,
          Type: 'bind',
        },
      ],
    },
  });
  await container.start();
  await container.wait();
  await container.remove();
}
