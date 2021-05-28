import { Injectable } from '@nestjs/common';
import { dump, load } from 'js-yaml';
import * as JSZip from 'jszip';
import { basename, join } from 'path';
import { ContestProblem } from '../entities';
import { EntityTransformer } from './entity.transformer';
import { ProblemTransformer } from './problem.transformer';

@Injectable()
export class ContestProblemTransformer
  implements EntityTransformer<ContestProblem>
{
  entityName = 'ContestProblem';

  constructor(private readonly problemTransformer: ProblemTransformer) {}

  async fromZipToMany(zip: JSZip, basePath = ''): Promise<ContestProblem[]> {
    return Promise.all(
      Object.keys(zip.files)
        .filter(
          (file) =>
            file.startsWith(basePath) &&
            new RegExp(`${basePath}[^\/]+\/ContestProblem\/$`, 'gm').test(file),
        )
        .map((folder) => folder.replace(/ContestProblem\/$/g, ''))
        .map((folder) => this.fromZip(zip.folder(basename(folder)), folder)),
    );
  }

  async fromZip(zip: JSZip, basePath = ''): Promise<ContestProblem> {
    const subZip = zip.folder(this.entityName);
    const problem = load(
      await subZip.file(`${this.entityName}.yaml`).async('string'),
    ) as ContestProblem;
    problem.problem = await this.problemTransformer.fromZip(
      subZip.folder('problem'),
      join(basePath, this.entityName, 'problem', '/'),
    );
    return problem;
  }

  async manyToZip(problems: ContestProblem[], zip: JSZip): Promise<void> {
    for (const problem of problems) {
      if (!problem.shortName) continue;
      await this.toZip(problem, zip.folder(problem.shortName));
    }
  }

  async toZip(problem: ContestProblem, zip: JSZip): Promise<void> {
    const subZip = zip.folder(this.entityName);
    const metadata = dump({
      shortName: problem.shortName,
      points: problem.points,
      allowSubmit: problem.allowSubmit,
      allowJudge: problem.allowJudge,
      color: problem.color,
    } as Partial<ContestProblem>);
    const problemZip = subZip.folder('problem');
    await this.problemTransformer.toZip(problem.problem, problemZip);
    subZip.file(`${this.entityName}.yaml`, metadata);
  }
}
