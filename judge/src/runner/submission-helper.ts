import { mkdirSync } from 'fs';
import { join } from 'path';
import { File, Submission } from '../models';

export const workDir = join(__dirname, '..', '..', 'workDir');
mkdirSync(workDir, { recursive: true });
export const dockerWorkDir = join('/', 'workDir');
export const assetsDir = join(__dirname, '..', '..', 'assets');
export const testLibPath = join(assetsDir, 'testlib.h');

export class SubmissionHelper {
  private submission: Submission;

  setSubmission(submission: Submission): void {
    this.submission = submission;
  }

  containerRunName = (): string =>
    `tun-judge-run-submission-${this.submission.id}-${Date.now()}`;

  containerBuildName = (): string =>
    `tun-judge-build-submission-${this.submission.id}-${Date.now()}`;

  checkerRunName = (): string =>
    `tun-judge-run-checker-${
      this.submission.problem.checkScript.id
    }-${Date.now()}`;

  checkerBuildName = (): string =>
    `tun-judge-build-checker-${
      this.submission.problem.checkScript.id
    }-${Date.now()}`;

  runCmd = (): string[] => {
    const {
      problem: { runScript },
    } = this.submission;
    return [
      'bash',
      '-c',
      `timeout ${
        this.submission.problem.timeLimit
      } time ${this.executableFilePath(
        runScript.id,
        runScript.file,
        true,
      )} ${this.binPath(true)} test.in test.out`,
    ];
  };

  compileCmd = (): string[] => [
    this.languageFilePath(true),
    this.filePath(true),
    this.binPath(true),
    String(this.submission.problem.memoryLimit),
  ];

  testFilesPath = (filename: string, docker = false): string =>
    join(this.submissionDir(docker), filename);

  checkerRunCmd = (): string[] => {
    const {
      problem: { checkScript },
    } = this.submission;
    return [
      this.executableBinPath(checkScript.id, checkScript.file, true),
      this.testFilesPath('test.in', true),
      this.testFilesPath('test.out', true),
      this.testFilesPath('test.ans', true),
    ];
  };

  checkerCompileCmd = (): string[] => {
    const {
      problem: { checkScript },
    } = this.submission;
    return [
      this.executableFilePath(checkScript.id, checkScript.buildScript, true),
      this.executableFilePath(checkScript.id, checkScript.file, true),
      this.executableBinPath(checkScript.id, checkScript.file, true),
    ];
  };

  submissionDir = (docker = false): string => {
    const dir = join(
      docker ? dockerWorkDir : workDir,
      'submissions',
      String(this.submission.id),
    );
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  filePath = (docker = false): string =>
    join(this.submissionDir(docker), this.submission.file.name);

  binPath = (docker = false): string =>
    this.filePath(docker).replace(/\.[^.]*$/g, '');

  problemDir = (docker = false): string => {
    const dir = join(
      docker ? dockerWorkDir : workDir,
      'problems',
      String(this.submission.problem.id),
    );
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageDir = (docker = false): string => {
    const dir = join(
      docker ? dockerWorkDir : workDir,
      'languages',
      String(this.submission.language.id),
    );
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFileDir = (docker = false): string => {
    const dir = join(
      this.languageDir(docker),
      this.submission.language.buildScript.md5Sum,
    );
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFilePath = (docker = false): string =>
    join(
      this.languageFileDir(docker),
      this.submission.language.buildScript.name,
    );

  testcaseDir = (id: number, docker = false): string => {
    const dir = join(this.problemDir(docker), 'testcases', String(id));
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  testcaseFileDir = (id: number, file: File, docker = false): string => {
    const dir = join(this.testcaseDir(id, docker), file.md5Sum);
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  testcaseFilePath = (id: number, file: File, docker = false): string =>
    join(this.testcaseFileDir(id, file, docker), file.name);

  executableDir = (id: number, docker = false): string => {
    const dir = join(
      docker ? dockerWorkDir : workDir,
      'executables',
      String(id),
    );
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFileDir = (id: number, file: File, docker = false): string => {
    const dir = join(this.executableDir(id, docker), file.md5Sum);
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFilePath = (id: number, file: File, docker = false): string =>
    join(this.executableFileDir(id, file, docker), file.name);

  executableBinPath = (id: number, file: File, docker = false): string =>
    join(this.executableFileDir(id, file, docker), file.name).replace(
      /\.[^.]*$/g,
      '',
    );
}

const submissionHelper = new SubmissionHelper();

export default submissionHelper;
