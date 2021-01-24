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

  async fromZipToMany(zip: JSZip, basePath = ''): Promise<Executable[]> {
    return Promise.all(
      Object.keys(zip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            new RegExp(`${basePath}[^\/]+\/Executable\/$`, 'gm').test(file),
        )
        .map((folder) => folder.replace(/Executable\/$/g, ''))
        .map((folder) => this.fromZip(zip.folder(basename(folder)), folder)),
    );
  }

  async fromZip(zip: JSZip, basePath = ''): Promise<Executable> {
    const subZip = zip.folder(this.entityName);
    const executable = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Executable;
    executable.default = false;
    const filePath = Object.keys(subZip.files).find(
      (file) =>
        file.startsWith(`${basePath}Executable/`) &&
        ![
          `${basePath}Executable/`,
          `${basePath}Executable/build`,
          `${basePath}Executable/Executable.yaml`,
        ].includes(file),
    );
    if (!filePath) throw new NotFoundException();
    const filePayload = await subZip.file(basename(filePath)).async('string');
    const fileBase64 = Buffer.from(filePayload).toString('base64');
    executable.file = {
      name: basename(filePath),
      size: filePayload.length,
      type: 'plain/text',
      md5Sum: MD5(fileBase64).toString(),
      content: { payload: fileBase64 },
    } as File;
    if (Object.keys(subZip.files).includes(`${basePath}Executable/build`)) {
      const buildPayload = await subZip.file('build').async('string');
      const buildBase64 = Buffer.from(buildPayload).toString('base64');
      executable.buildScript = {
        name: 'build',
        size: buildPayload.length,
        type: 'plain/text',
        md5Sum: MD5(buildBase64).toString(),
        content: { payload: buildBase64 },
      } as File;
    }
    return executable;
  }

  async manyToZip(executables: Executable[], zip: JSZip): Promise<void> {
    for (const executable of executables) {
      if (!executable.id) continue;
      await this.toZip(executable, zip.folder(String(executable.id)));
    }
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
