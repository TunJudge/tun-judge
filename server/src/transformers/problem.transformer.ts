import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { File, Problem } from '../entities';
import { EntityTransformer } from './entity.transformer';
import { TestcaseTransformer } from './testcase.transformer';

@Injectable()
export class ProblemTransformer implements EntityTransformer<Problem> {
  entityName = 'Problem';

  constructor(private readonly testcaseTransformer: TestcaseTransformer) {}

  async fromZip(zip: JSZip, basePath = ''): Promise<Problem> {
    const subZip = zip.folder(this.entityName);
    const problem = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Problem;
    const pdfBase64 = await subZip.file('file.pdf').async('base64');
    problem.file = {
      name: 'file.pdf',
      size: pdfBase64.length,
      type: 'application/pdf',
      md5Sum: MD5(pdfBase64).toString(),
      content: { payload: pdfBase64 },
    } as File;
    const testcasesZip = subZip.folder('testcases');
    problem.testcases = await Promise.all(
      Object.keys(testcasesZip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            /Problem\/testcases\/[^\/]+\/$/g.test(file),
        )
        .map((folder) =>
          this.testcaseTransformer.fromZip(
            testcasesZip.folder(basename(folder)),
            folder,
          ),
        ),
    );
    return problem;
  }

  async toZip(problem: Problem, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      name: problem.name,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      outputLimit: problem.outputLimit,
    } as Partial<Problem>);
    subZip.file('file.pdf', problem.file.content.payload, { base64: true });
    if (problem.testcases) {
      const testcasesZip = subZip.folder('testcases');
      for (const testcase of problem.testcases) {
        const testcaseZip = testcasesZip.folder(String(testcase.rank));
        await this.testcaseTransformer.toZip(testcase, testcaseZip);
      }
    }
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
