import { chmodSync, promises, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { AbstractRunnerStep } from './runner-step';
import { Submission } from '../models';
import sh, { dockerWorkDir, workDir } from './submission-helper';
import dockerService from '../services/docker.service';
import { Logger } from '@nestjs/common';
import { Container } from 'dockerode';

export class Executor extends AbstractRunnerStep {
  async run(submission: Submission): Promise<void> {
    const { testcases, runScript } = submission.problem;
    chmodSync(sh.executableFilePath(runScript.id, runScript.file), '0775');
    const runnerContainer = await createContainer(
      submission,
      sh.containerRunName(),
      submission.language.dockerImage,
    );
    const checkerContainer = await createContainer(
      submission,
      sh.checkerRunName(),
      submission.problem.checkScript.dockerImage,
    );
    await runnerContainer.start();
    await checkerContainer.start();
    for (const testcase of testcases.sort((a, b) => a.rank - b.rank)) {
      logger.log(`Running test ${testcase.rank}...`);
      await Promise.all([
        promises.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.input),
          join(sh.submissionDir(), 'test.in'),
        ),
        promises.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.output),
          join(sh.submissionDir(), 'test.ans'),
        ),
      ]);
      const runningResult = await execCmdInDocker(runnerContainer, sh.runCmd());
      if (runningResult.exitCode !== 0) {
        logger.error(
          `Submission with id ${submission.id} failed for test ${testcase.rank}: ${runningResult.stderr}`,
        );
        return;
      }
      const checkingResult = await execCmdInDocker(
        checkerContainer,
        sh.checkerRunCmd(),
      );
      if (checkingResult.exitCode !== 0) {
        logger.error(
          `Submission with id ${submission.id} failed for test ${testcase.rank}: ${checkingResult.stdout}`,
        );
        return;
      }
    }
    logger.log(`Submission with id ${submission.id} is correct!`);
    rmdirSync(sh.submissionDir(), { recursive: true });
    await runnerContainer.kill();
    await checkerContainer.kill();
    await runnerContainer.remove();
    await checkerContainer.remove();
  }
}

const logger = new Logger(Executor.name);

function createContainer(
  submission: Submission,
  name: string,
  dockerImage: string,
): Promise<Container> {
  return dockerService.createContainer({
    Image: dockerImage,
    name: name,
    OpenStdin: true,
    WorkingDir: sh.submissionDir(true),
    HostConfig: {
      CpusetCpus: '0-3',
      Mounts: [
        {
          Target: dockerWorkDir,
          Source: workDir,
          Type: 'bind',
        },
      ],
    },
  });
}

type ExecResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

function execCmdInDocker(
  container: Container,
  cmd: string[],
): Promise<ExecResult> {
  return new Promise<ExecResult>(async (resolve) => {
    const result: ExecResult = {
      exitCode: 0,
      stdout: '',
      stderr: '',
    };
    const exec = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });
    const duplex = await exec.start({ hijack: true });
    duplex.on('data', (chunk) => (result.stdout += chunk));
    duplex.on('error', (chunk) => (result.stderr += chunk));
    duplex.on('end', async () =>
      resolve({
        ...result,
        exitCode: (await exec.inspect()).ExitCode,
      }),
    );
  });
}
