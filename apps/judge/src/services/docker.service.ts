import { Injectable } from '@nestjs/common';
import Docker, { Container, ContainerCreateOptions } from 'dockerode';

import { SubmissionHelper } from '../helpers';
import { getOnLog, JudgeLogger } from '../logger';
import { SocketService } from './socket.service';

export type ExecResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

@Injectable()
export class DockerService {
  private readonly logger: JudgeLogger;
  private readonly connection: Docker;

  constructor(
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper
  ) {
    this.logger = new JudgeLogger(
      DockerService.name,
      getOnLog(this.socketService)
    );
    this.connection = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async pullImage(tag: string): Promise<void> {
    try {
      await this.connection.getImage(tag).inspect();
    } catch (e) {
      return new Promise<void>((resolve, reject) => {
        this.connection.pull(tag, {}, (error, stream) => {
          if (error) {
            reject(error);
            return;
          }
          this.connection.modem.followProgress(
            stream,
            (error: Error | null) => (error ? reject(error) : resolve()),
            ({ status }: { status: string }) =>
              this.logger.debug(`${tag}: ${status}`)
          );
        });
      });
    }
  }

  createContainer(options: ContainerCreateOptions): Promise<Container> {
    options.OpenStdin ??= true;
    options.WorkingDir ??= this.submissionHelper.submissionDir();
    options.HostConfig = {
      Mounts: [
        {
          Target: this.submissionHelper.workDir,
          Source: this.submissionHelper.workDir,
          Type: 'bind',
        },
      ],
      ...options?.HostConfig,
    };
    return this.connection.createContainer(options);
  }

  async execCmdInDocker(
    container: Container,
    cmd: string[],
    workDir?: string
  ): Promise<ExecResult> {
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
      WorkingDir: workDir,
    });
    const duplex = await exec.start({ hijack: true });

    return new Promise<ExecResult>((resolve) => {
      duplex.on('data', (chunk) => (result.stdout += chunk));
      duplex.on('error', (chunk) => (result.stderr += chunk));
      duplex.on('end', async () =>
        resolve({
          ...result,
          exitCode: (await exec.inspect()).ExitCode ?? 1,
        })
      );
    });
  }

  async pruneContainer(...containers: Container[]): Promise<void> {
    for (const container of containers) {
      await container.kill();
      await container.remove();
    }
  }
}
