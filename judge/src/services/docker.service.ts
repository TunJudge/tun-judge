import { Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Container, ContainerCreateOptions } from 'dockerode';
import sh, { workDir } from '../runner/submission-helper';
import { JudgeLogger } from './judge.logger';

export type ExecResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

export class DockerService {
  private connection: Docker;
  private logger: Logger = new JudgeLogger(DockerService.name);

  constructor() {
    this.connection = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async pullImage(tag: string): Promise<string> {
    try {
      await this.connection.getImage(tag).inspect();
    } catch (e) {
      return new Promise<string>((resolve, reject) => {
        this.connection.pull(tag, null, (error, stream) => {
          if (error) {
            reject(error);
            return;
          }
          this.connection.modem.followProgress(
            stream,
            (error, result) =>
              error ? reject(error) : resolve(result.pop().status),
            ({ status }) => this.logger.debug(`${tag}: ${status}`),
          );
        });
      });
    }
  }

  createContainer(options: ContainerCreateOptions): Promise<Container> {
    options.OpenStdin ??= true;
    options.WorkingDir ??= sh.submissionDir();
    options.HostConfig = {
      Mounts: [
        {
          Target: workDir,
          Source: workDir,
          Type: 'bind',
        },
      ],
      ...options?.HostConfig,
    };
    return this.connection.createContainer(options);
  }

  execCmdInDocker(
    container: Container,
    cmd: string[],
    workDir?: string,
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
        WorkingDir: workDir,
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

  async pruneContainer(...containers: Container[]): Promise<void> {
    for (const container of containers) {
      await container.kill();
      await container.remove();
    }
  }
}

const dockerService = new DockerService();

export default dockerService;
