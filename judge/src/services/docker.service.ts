import { Logger } from '@nestjs/common';
import * as Docker from 'dockerode';

export class DockerService {
  private connection: Docker;
  private logger: Logger = new Logger(DockerService.name);

  constructor() {
    this.connection = new Docker({ socketPath: '/var/run/docker.sock' });
    // Object.entries(languageImages).forEach(
    //   async ([language, dockerImageTag]) => {
    //     try {
    //       await this.connection.getImage(dockerImageTag).inspect();
    //     } catch (e) {
    //       this.logger.log(
    //         `Pulling docker image of language '${language}' with tag '${dockerImageTag}'`,
    //       );
    //       this.pullImage(dockerImageTag)
    //         .then(() =>
    //           this.logger.log(
    //             `Docker image of language '${language}' with tag '${dockerImageTag}' is pulled successfully`,
    //           ),
    //         )
    //         .catch((error) =>
    //           this.logger.error(
    //             `Could not pull docker image of language '${language}' with tag '${dockerImageTag}': ${error.message}`,
    //           ),
    //         );
    //     }
    //   },
    // );
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

  // async runFile(file: string, language: Language): Promise<string> {
  //   const tmpDirName = mkdtempSync(join(os.tmpdir(), 'tun-judge-judge-'));
  //   writeFileSync(
  //     join(tmpDirName, 'main.cpp'),
  //     readFileSync(
  //       '/home/nasreddine/projects/personal/codeforces_workdir/main.cpp',
  //       { encoding: 'utf-8' },
  //     ),
  //   );
  //   const container = await this.connection.createContainer({
  //     Image: languageImages[language],
  //     OpenStdin: true,
  //     HostConfig: {
  //       Mounts: [
  //         {
  //           Target: '/opt/code',
  //           Source: tmpDirName,
  //           Type: 'bind',
  //         },
  //       ],
  //     },
  //   });
  //   await container.start();
  //   (
  //     await (
  //       await container.exec({
  //         Cmd: ['g++', 'main.cpp', '-o', 'main'],
  //         AttachStdin: true,
  //         AttachStdout: true,
  //         AttachStderr: true,
  //         WorkingDir: '/opt/code',
  //       })
  //     ).start({ hijack: true })
  //   ).on('end', async () => {
  //     await this.execTest(container, tmpDirName, 0);
  //     await this.execTest(container, tmpDirName, 1);
  //     await container.kill();
  //     await container.remove();
  //     rmdirSync(tmpDirName, { recursive: true });
  //   });
  //   return container.id;
  // }
  //
  // execTest(
  //   container: Container,
  //   tmpDirName: string,
  //   testNumber: number,
  // ): Promise<void> {
  //   return new Promise<void>(async (resolve) => {
  //     this.logger.log(`Running test ${testNumber}`);
  //     writeFileSync(
  //       join(tmpDirName, 'test.in'),
  //       readFileSync(
  //         `/home/nasreddine/projects/personal/codeforces_workdir/files/test${testNumber}.in`,
  //         { encoding: 'utf-8' },
  //       ),
  //     );
  //     const exec = await container.exec({
  //       Cmd: ['sh', '-c', 'time ./main < test.in > test.out'],
  //       AttachStdin: true,
  //       AttachStdout: true,
  //       AttachStderr: true,
  //       WorkingDir: '/opt/code',
  //     });
  //     const duplex = await exec.start({ hijack: true, stdin: true });
  //     duplex.pipe(createWriteStream(join(tmpDirName, 'time.out')));
  //     duplex.on('end', async () => {
  //       console.log(
  //         'out',
  //         readFileSync(join(tmpDirName, 'test.out'), 'utf-8').trim(),
  //       );
  //       const time = /real\s*0m([^s]*)s/g.exec(
  //         readFileSync(join(tmpDirName, 'time.out'), 'utf-8'),
  //       )[1];
  //       console.log('time', time);
  //       resolve();
  //     });
  //     duplex.end();
  //   });
  // }
}

const dockerService = new DockerService();

export default dockerService;
