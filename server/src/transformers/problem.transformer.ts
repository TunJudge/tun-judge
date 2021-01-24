import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { File, Problem, Testcase } from '../entities';
import { EntityTransformer } from './entity.transformer';
import { TestcaseTransformer } from './testcase.transformer';

@Injectable()
export class ProblemTransformer implements EntityTransformer<Problem> {
  entityName = 'Problem';

  constructor(private readonly testcaseTransformer: TestcaseTransformer) {}

  async fromZip(zip: JSZip): Promise<Problem> {
    const subZip = zip.folder(this.entityName);
    const problem = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Problem;
    const pdfPayload = await subZip.file('file.pdf').async('base64');
    problem.file = {
      name: 'file.pdf',
      size: pdfPayload.length,
      type: 'application/pdf',
      md5Sum: MD5(pdfPayload).toString(),
      content: {
        payload: pdfPayload,
      },
    } as File;
    problem.testcases = [];
    const testcaseZip = subZip.folder('testcases');
    await parseTestcases(testcaseZip.folder('sample'), problem);
    await parseTestcases(testcaseZip.folder('secret'), problem, false);
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
      const sampleTestcasesZip = testcasesZip.folder('sample');
      const secretTestcasesZip = testcasesZip.folder('secret');
      await Promise.all(
        problem.testcases.map((testcase) =>
          this.testcaseTransformer.toZip(
            testcase,
            testcase.sample ? sampleTestcasesZip : secretTestcasesZip,
          ),
        ),
      );
    }
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}

async function parseTestcases(subZip: JSZip, problem: Problem, sample = true) {
  const testcases: { [index: string]: { in: string; ans: string } } = {};
  Object.keys(subZip.files).forEach((file) => {
    if (sample !== file.includes('/sample/')) return;
    const match = /([0-9]+)\.(in|ans)$/g.exec(file);
    if (match !== null) {
      const [, index, type] = match;
      testcases[index] = {
        ...testcases[index],
        [type]: file,
      };
    }
  });
  for (const { in: _in, ans } of Object.values(testcases)) {
    const inputPayload = await subZip.file(basename(_in)).async('string');
    const outputPayload = await subZip.file(basename(ans)).async('string');
    const rank = problem.testcases.length;
    problem.testcases.push({
      sample: sample,
      rank: rank,
      input: {
        name: `test${rank}.in`,
        size: inputPayload.length,
        type: 'plain/text',
        md5Sum: MD5(inputPayload).toString(),
        content: {
          payload: Buffer.from(inputPayload).toString('base64'),
        },
      },
      output: {
        name: `test${rank}.ans`,
        size: outputPayload.length,
        type: 'plain/text',
        md5Sum: MD5(outputPayload).toString(),
        content: {
          payload: Buffer.from(outputPayload).toString('base64'),
        },
      },
    } as Testcase);
  }
}
