import { Injectable } from '@nestjs/common';
import * as JSZip from 'jszip';
import { Testcase } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class TestcaseTransformer implements EntityTransformer<Testcase> {
  entityName = 'Testcase';

  async fromZip(zip: JSZip): Promise<Testcase> {
    return {} as Testcase;
  }

  async toZip(testcase: Testcase, zip: JSZip): Promise<void> {
    zip.file(`test${testcase.rank}.in`, testcase.input.content.payload, {
      base64: true,
    });
    zip.file(`test${testcase.rank}.ans`, testcase.output.content.payload, {
      base64: true,
    });
    if (testcase.image) {
      zip.file(testcase.image.name, testcase.image.content.payload, {
        base64: true,
      });
    }
  }
}
