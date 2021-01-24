import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename } from 'path';
import { File, Language } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class LanguageTransformer implements EntityTransformer<Language> {
  entityName = 'Language';

  async fromZipToMany(zip: JSZip, basePath = ''): Promise<Language[]> {
    return Promise.all(
      Object.keys(zip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            new RegExp(`${basePath}[^\/]+\/Language\/$`, 'gm').test(file),
        )
        .map((folder) => folder.replace(/Language\/$/g, ''))
        .map((folder) => this.fromZip(zip.folder(basename(folder)), folder)),
    );
  }

  async fromZip(zip: JSZip, basePath = ''): Promise<Language> {
    const subZip = zip.folder(this.entityName);
    const language = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Language;
    const buildPayload = await subZip.file('build').async('string');
    const buildBase64 = Buffer.from(buildPayload).toString('base64');
    language.buildScript = {
      name: 'build',
      size: buildPayload.length,
      type: 'plain/text',
      md5Sum: MD5(buildBase64).toString(),
      content: { payload: buildBase64 },
    } as File;
    return language;
  }

  async manyToZip(languages: Language[], zip: JSZip): Promise<void> {
    for (const language of languages) {
      if (!language.name) continue;
      await this.toZip(language, zip.folder(language.name));
    }
  }

  async toZip(language: Language, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      name: language.name,
      dockerImage: language.dockerImage,
      extensions: language.extensions,
      allowSubmit: language.allowSubmit,
      allowJudge: language.allowJudge,
    } as Partial<Language>);
    subZip.file('build', language.buildScript.content.payload, {
      base64: true,
    });
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
