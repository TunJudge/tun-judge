import { copyFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { File, Submission, Testcase } from '../models';

export const workDir = join(tmpdir(), 'tun-judge', 'workDir');
mkdirSync(workDir, { recursive: true });
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
        this.assetsFilePath('guard'),
        this.submission.problem.timeLimit * 1000,
        this.submission.problem.memoryLimit,
        `'${this.executableFilePath(
          runScript.id,
          runScript.file,
        )} ${this.binPath()}'`,
        this.testcaseFilePath(testcase.id, testcase.input),
        'test.out',
        'test.err',
      ].join(' '),
    ];
  };

  compileCmd = (): string[] => [
    this.languageFilePath(),
    this.filePath(),
    this.binPath(),
    String(this.submission.problem.memoryLimit),
  ];

  extraFilesPath = (filename: string): string =>
    join(this.submissionDir(), filename);

  checkerRunCmd = (testcase: Testcase): string[] => {
    const {
      problem: { checkScript },
    } = this.submission;
    return [
      this.executableBinPath(checkScript.id, checkScript.file),
      this.testcaseFilePath(testcase.id, testcase.input),
      this.extraFilesPath('test.out'),
      this.testcaseFilePath(testcase.id, testcase.output),
      this.extraFilesPath('checker.out'),
    ];
  };

  checkerCompileCmd = (): string[] => {
    const {
      problem: { checkScript },
    } = this.submission;
    return [
      this.executableFilePath(checkScript.id, checkScript.buildScript),
      this.executableFilePath(checkScript.id, checkScript.file),
      this.executableBinPath(checkScript.id, checkScript.file),
    ];
  };

  submissionDir = (): string => {
    const dir = join(workDir, 'submissions', String(this.submission.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  runTestcaseDir = (rank: number): string => {
    const dir = join(this.submissionDir(), String(rank));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  filePath = (): string =>
    join(this.submissionDir(), this.submission.file.name.replace(/ /g, '_'));

  binPath = (): string => this.filePath().replace(/\.[^.]*$/g, '');

  problemDir = (): string => {
    const dir = join(workDir, 'problems', String(this.submission.problem.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageDir = (): string => {
    const dir = join(workDir, 'languages', String(this.submission.language.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFileDir = (): string => {
    const dir = join(
      this.languageDir(),
      this.submission.language.buildScript.md5Sum,
    );
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFilePath = (): string =>
    join(this.languageFileDir(), this.submission.language.buildScript.name);

  testcaseDir = (id: number): string => {
    const dir = join(this.problemDir(), 'testcases', String(id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  testcaseFileDir = (id: number, file: File): string => {
    const dir = join(this.testcaseDir(id), file.md5Sum);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  testcaseFilePath = (id: number, file: File): string =>
    join(this.testcaseFileDir(id, file), file.name);

  executableDir = (id: number): string => {
    const dir = join(workDir, 'executables', String(id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFileDir = (id: number, file: File): string => {
    const dir = join(this.executableDir(id), file.md5Sum);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFilePath = (id: number, file: File): string =>
    join(this.executableFileDir(id, file), file.name);

  executableBinPath = (id: number, file: File): string =>
    join(this.executableFileDir(id, file), file.name).replace(/\.[^.]*$/g, '');

  assetsDir = (): string => {
    const dir = join(workDir, 'assets');
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  assetsFilePath = (fileName: string): string =>
    join(this.assetsDir(), fileName);
}

const submissionHelper = new SubmissionHelper();

// Copy the guard code source to the workDir/assets folder to be compiled later
copyFileSync(guardCppPath, submissionHelper.assetsFilePath('guard.cpp'));

export default submissionHelper;
