import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import { File, Submission, Testcase } from '../models';

export const workDir = join(__dirname, '..', '..', 'workDir');
mkdirSync(workDir, { recursive: true });
export const dockerWorkDir = join('/', 'workDir');
export const assetsDir = join(__dirname, '..', '..', 'assets');
export const testLibPath = join(assetsDir, 'testlib.h');
export const guardCppPath = join(assetsDir, 'guard.cpp');

/**
 * SubmissionHelper helps creating generating the right folders and files paths
 * that are related to the submission and also assure creating the directories
 */
export class SubmissionHelper {
  private submission: Submission;

  setSubmission(submission: Submission): void {
    this.submission = submission;
  }

  runContainerName = (): string =>
    `tun-judge-run-submission-${this.submission.id}-${Date.now()}`;

  compileContainerName = (): string =>
    `tun-judge-build-submission-${this.submission.id}-${Date.now()}`;

  runCheckerContainerName = (): string =>
    `tun-judge-run-checker-${
      this.submission.problem.checkScript.id
    }-${Date.now()}`;

  compileCheckerContainerName = (): string =>
    `tun-judge-build-checker-${
      this.submission.problem.checkScript.id
    }-${Date.now()}`;

  runCmd = (testcase: Testcase): string[] => {
    const {
      problem: { runScript },
    } = this.submission;
    return [
      'bash',
      '-c',
      [
        this.assetsFilePath('guard', true),
        this.submission.problem.timeLimit * 1000,
        this.submission.problem.memoryLimit,
        `'${this.executableFilePath(
          runScript.id,
          runScript.file,
          true,
        )} ${this.binPath(true)}'`,
        this.testcaseFilePath(testcase.id, testcase.input, true),
        'test.out',
      ].join(' '),
    ];
  };

  compileCmd = (): string[] => [
    this.languageFilePath(true),
    this.filePath(true),
    this.binPath(true),
    String(this.submission.problem.memoryLimit),
  ];

  extraFilesPath = (filename: string, docker = false): string =>
    join(this.submissionDir(docker), filename);

  checkerRunCmd = (testcase: Testcase): string[] => {
    const {
      problem: { checkScript },
    } = this.submission;
    return [
      this.executableBinPath(checkScript.id, checkScript.file, true),
      this.testcaseFilePath(testcase.id, testcase.input, true),
      this.extraFilesPath('test.out', true),
      this.testcaseFilePath(testcase.id, testcase.output, true),
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

  runTestcaseDir = (rank: number, docker = false): string => {
    const dir = join(this.submissionDir(docker), String(rank));
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

  assetsDir = (docker = false): string => {
    const dir = join(docker ? dockerWorkDir : workDir, 'assets');
    !docker && mkdirSync(dir, { recursive: true });
    return dir;
  };

  assetsFilePath = (fileName: string, docker = false): string =>
    join(this.assetsDir(docker), fileName);
}

const submissionHelper = new SubmissionHelper();

// Copy the guard code source to the workDir/assets folder to be compiled later
copyFileSync(guardCppPath, submissionHelper.assetsFilePath('guard.cpp'));

export default submissionHelper;
