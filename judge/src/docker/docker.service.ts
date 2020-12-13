import { Injectable, Logger } from "@nestjs/common";
import { createWriteStream, mkdtempSync, readFileSync, rmdirSync, writeFileSync } from "fs";
import * as Docker from "dockerode";
import languageImages, { Language } from "../config/language-images";
import { join } from "path";
import * as os from "os";

@Injectable()
export class DockerService {
  private connection: Docker;
  private logger: Logger = new Logger(DockerService.name);

  constructor() {
    this.connection = new Docker({ socketPath: '/var/run/docker.sock' });
    // Object.entries(languageImages).forEach(([language, dockerImageTag]) => {
    //   this.logger.log(
    //     `Pulling docker image of language '${language}' with tag '${dockerImageTag}'`,
    //   );
    //   this.pullImage(dockerImageTag)
    //     .then(() =>
    //       this.logger.log(
    //         `Docker image of language '${language}' with tag '${dockerImageTag}' is pulled successfully`,
    //       ),
    //     )
    //     .catch((error) =>
    //       this.logger.error(
    //         `Could not pull docker image of language '${language}' with tag '${dockerImageTag}': ${error.message}`,
    //       ),
    //     );
    // });
  }

  pullImage(tag: string): Promise<string> {
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

  async runFile(file: string, language: Language): Promise<string> {
    const tmpDirName = mkdtempSync(join(os.tmpdir(), 'tun-judge-judge-'));
    const code = readFileSync(
      '/home/nasreddine/projects/personal/codeforces_workdir/main.cpp',
      { encoding: 'utf-8' },
    );
    writeFileSync(join(tmpDirName, 'main.cpp'), code);
    const container = await this.connection.createContainer({
      Image: languageImages[language],
      OpenStdin: true,
      HostConfig: {
        Mounts: [
          {
            Target: '/opt/code',
            Source: tmpDirName,
            Type: 'bind',
          },
        ],
      },
    });
    await container.start();
    (
      await (
        await container.exec({
          Cmd: ['g++', 'main.cpp', '-o', 'main'],
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          WorkingDir: '/opt/code',
        })
      ).start({ hijack: true })
    ).on('end', async () => {
      const exec = await container.exec({
        Cmd: ['./main'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: '/opt/code',
      });
      const duplex = await exec.start({ hijack: true, stdin: true });
      this.connection.modem.demuxStream(process.stdout, process.stderr);
      duplex.pipe(createWriteStream(join(tmpDirName, 'out')));
      duplex.end(
        readFileSync(
          '/home/nasreddine/projects/personal/codeforces_workdir/files/test0.in',
          { encoding: 'utf-8' },
        ),
      );
      duplex.on('end', async () => {
        await container.stop();
        await container.remove();
        rmdirSync(tmpDirName, { recursive: true });
      });
    });
    return container.id;
  }
}
