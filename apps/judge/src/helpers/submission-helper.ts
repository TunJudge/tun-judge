import { Injectable } from '@nestjs/common';
import { copyFileSync, mkdirSync } from 'fs';
import { join, parse, resolve } from 'path';

import { File } from '@prisma/client';

import config from '../config';
import { Submission, Testcase } from '../models';

/**
 * SubmissionHelper helps creating generating the right folders and files paths
 * that are related to the submission and also assure creating the directories
 */
@Injectable()
export class SubmissionHelper {
  private submission: Submission = {} as Submission;
  private readonly guardCppPath: string;

  readonly workDir: string = resolve(config.workDir);
  readonly testLibPath: string;

  constructor() {
    mkdirSync(this.workDir, { recursive: true });

    const originalAssetsDir = join(__dirname, 'assets');
    this.testLibPath = join(originalAssetsDir, 'testlib.h');
    this.guardCppPath = join(originalAssetsDir, 'guard.cpp');

    // Copy the guard code source to the workDir/assets folder to be compiled later
    copyFileSync(this.guardCppPath, this.assetsFilePath('guard.cpp'));
  }

  setSubmission(submission: Submission): void {
    this.submission = submission;
  }

  runCmd = (testcase: Testcase): string[] => {
    const {
      problem: { timeLimit, memoryLimit, runScript },
    } = this.submission.problem;
    return [
      'bash',
      '-c',
      [
        this.assetsFilePath('guard'),
        timeLimit * 1000,
        memoryLimit,
        `'${this.executableFilePath(runScript.id, runScript.sourceFile)} ${this.binPath()}'`,
        this.testcaseFilePath(testcase.id, testcase.inputFile),
        'test.out',
        'test.err',
      ].join(' '),
    ];
  };

  compileCmd = (): string[] => [
    this.languageFilePath(),
    this.filePath(),
    this.binPath(),
    String(this.submission.problem.problem.memoryLimit),
  ];

  extraFilesPath = (filename: string): string => join(this.submissionDir(), filename);

  checkerRunCmd = (testcase: Testcase): string[] => {
    const {
      problem: { checkScript },
    } = this.submission.problem;
    return [
      this.executableBinPath(checkScript.id, checkScript.sourceFile),
      this.testcaseFilePath(testcase.id, testcase.inputFile),
      this.extraFilesPath('test.out'),
      this.testcaseFilePath(testcase.id, testcase.outputFile),
      this.extraFilesPath('checker.out'),
    ];
  };

  checkerCompileCmd = (): string[] => {
    const {
      problem: { checkScript },
    } = this.submission.problem;
    return [
      this.executableFilePath(checkScript.id, checkScript.buildScript),
      this.executableFilePath(checkScript.id, checkScript.sourceFile),
      this.executableBinPath(checkScript.id, checkScript.sourceFile),
    ];
  };

  submissionDir = (): string => {
    const dir = join(this.workDir, 'submissions', String(this.submission.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  runTestcaseDir = (rank: number): string => {
    const dir = join(this.submissionDir(), String(rank));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  filePath = (): string =>
    join(this.submissionDir(), parse(this.submission.sourceFileName).base.replace(/ /g, '_'));

  binPath = (): string => this.filePath().replace(/\.[^.]*$/g, '');

  problemDir = (): string => {
    const dir = join(this.workDir, 'problems', String(this.submission.problem.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageDir = (): string => {
    const dir = join(this.workDir, 'languages', String(this.submission.language.id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFileDir = (): string => {
    const dir = join(this.languageDir(), this.submission.language.buildScript.md5Sum);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  languageFilePath = (): string =>
    join(this.languageFileDir(), parse(this.submission.language.buildScript.name).base);

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
    join(this.testcaseFileDir(id, file), parse(file.name).base);

  executableDir = (id: number): string => {
    const dir = join(this.workDir, 'executables', String(id));
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFileDir = (id: number, file: File): string => {
    const dir = join(this.executableDir(id), file.md5Sum);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  executableFilePath = (id: number, file: File): string =>
    join(this.executableFileDir(id, file), parse(file.name).base);

  executableBinPath = (id: number, file: File): string =>
    join(this.executableFileDir(id, file), parse(file.name).name);

  assetsDir = (): string => {
    const dir = join(this.workDir, 'assets');
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  assetsFilePath = (fileName: string): string => join(this.assetsDir(), fileName);
}
