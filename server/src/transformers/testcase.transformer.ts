import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { File, Testcase } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class TestcaseTransformer implements EntityTransformer<Testcase> {
  entityName = 'Testcase';

  async fromZip(zip: JSZip, basePath = ''): Promise<Testcase> {
    const subZip = zip.folder(this.entityName);
    const testcase = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Testcase;
    const inputPayload = await subZip.file('test.in').async('string');
    const inputBase64 = Buffer.from(inputPayload).toString('base64');
    testcase.input = {
      name: 'test.in',
      size: inputPayload.length,
      type: 'plain/text',
      md5Sum: MD5(inputBase64).toString(),
      content: { payload: inputBase64 },
    } as File;
    const outputPayload = await subZip.file('test.ans').async('string');
    const outputBase64 = Buffer.from(outputPayload).toString('base64');
    testcase.output = {
      name: 'test.ans',
      size: outputPayload.length,
      type: 'plain/text',
      md5Sum: MD5(outputBase64).toString(),
      content: { payload: outputBase64 },
    } as File;
    return testcase;
  }

  async toZip(testcase: Testcase, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      rank: testcase.rank,
      description: testcase.description,
      sample: testcase.sample,
      deleted: testcase.deleted,
    } as Partial<Testcase>);
    subZip.file(`test.in`, testcase.input.content.payload, {
      base64: true,
    });
    subZip.file(`test.ans`, testcase.output.content.payload, {
      base64: true,
    });
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
