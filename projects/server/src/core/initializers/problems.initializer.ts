import { Injectable } from '@nestjs/common';
import { Executable, Problem, Testcase } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class ProblemsInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const problems = await this.parseFolder('problems');
    for (let problem of problems) {
      problem.runScript = await entityManager.findOne(Executable, problem.runScript);
      problem.checkScript = await entityManager.findOne(Executable, problem.checkScript);
      problem.file = await this.createFileEntity(problem.file, entityManager);
      problem = await entityManager.save(Problem, problem);
      for (const testcase of problem.testcases) {
        testcase.problem = problem;
        for (const field of ['input', 'output']) {
          testcase[field] = await this.createFileEntity(testcase[field], entityManager);
        }
        await entityManager.save(Testcase, testcase);
      }
    }
  }
}
