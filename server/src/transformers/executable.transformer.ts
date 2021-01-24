import { Injectable, NotFoundException } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { Executable, File } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class ExecutableTransformer implements EntityTransformer<Executable> {
  entityName = 'Executable';

  async fromZip(zip: JSZip): Promise<Executable> {
    const subZip = zip.folder(this.entityName);
    const executable = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Executable;
    executable.default = false;
    const filePath = Object.keys(subZip.files).find(
      (file) =>
        ![
          'Executable/',
          'Executable/build',
          'Executable/Executable.yaml',
        ].includes(file),
    );
    if (!filePath) throw new NotFoundException();
    const filePayload = await subZip.file(basename(filePath)).async('string');
    executable.file = {
      name: basename(filePath),
      size: filePayload.length,
      type: 'plain/text',
      md5Sum: MD5(filePayload).toString(),
      content: {
        payload: Buffer.from(filePayload).toString('base64'),
      },
    } as File;
    if (Object.keys(subZip.files).includes('Executable/build')) {
      const buildPayload = await subZip.file('build').async('string');
      executable.buildScript = {
        name: 'build',
        size: buildPayload.length,
        type: 'plain/text',
        md5Sum: MD5(buildPayload).toString(),
        content: {
          payload: Buffer.from(buildPayload).toString('base64'),
        },
      } as File;
    }
    return executable;
  }

  async toZip(executable: Executable, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      name: executable.name,
      description: executable.description,
      default: executable.default,
      dockerImage: executable.dockerImage,
      type: executable.type,
    } as Partial<Executable>);
    subZip.file(executable.file.name, executable.file.content.payload, {
      base64: true,
    });
    if (executable.buildScript) {
      subZip.file('build', executable.buildScript.content.payload, {
        base64: true,
      });
    }
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
