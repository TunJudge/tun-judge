import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { File, Language } from '../entities';
import { EntityTransformer } from './entity.transformer';

@Injectable()
export class LanguageTransformer implements EntityTransformer<Language> {
  entityName = 'Language';

  async fromZip(zip: JSZip): Promise<Language> {
    const subZip = zip.folder(this.entityName);
    const language = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as Language;
    const buildPayload = await subZip.file('build').async('string');
    language.buildScript = {
      name: 'build',
      size: buildPayload.length,
      type: 'plain/text',
      md5Sum: MD5(buildPayload).toString(),
      content: {
        payload: Buffer.from(buildPayload).toString('base64'),
      },
    } as File;
    return language;
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
