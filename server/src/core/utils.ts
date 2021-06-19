import { Response } from 'express';
import * as JSZip from 'jszip';
import { Contest, Judging, JudgingResult, Submission } from '../entities';
import { EntityTransformer } from '../transformers/entity.transformer';

export function getFirstJudging(submission: Submission): Judging | undefined {
  return submission.judgings.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0];
}

export function submissionHasResult(
  { verificationRequired }: Contest,
  results: JudgingResult[],
  inverse = false,
): (submission: Submission) => boolean {
  return (submission) => {
    const judging = getFirstJudging(submission);
    const answer =
      results.includes(judging?.result) && !(verificationRequired && !judging.verified);
    return inverse ? !answer : answer;
  };
}

export function submissionIsPending({
  verificationRequired,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    const judging = getFirstJudging(submission);
    return !judging?.result || (verificationRequired && !judging.verified);
  };
}

export function submissionInFreezeTime({
  freezeTime,
  unfreezeTime,
  endTime,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    freezeTime = new Date(freezeTime ?? endTime);
    unfreezeTime = new Date(unfreezeTime ?? endTime);
    const now = Date.now();
    return (
      freezeTime !== unfreezeTime &&
      submission.submitTime.getTime() >= freezeTime.getTime() &&
      submission.submitTime.getTime() < unfreezeTime.getTime() &&
      now >= freezeTime.getTime() &&
      now < unfreezeTime.getTime()
    );
  };
}

export function cleanNullProblems(contest: Contest): Contest {
  contest.problems = contest.problems.filter((problem) => !!problem.shortName);
  return contest;
}

export async function unzipEntities<T>(
  file,
  multiple: string,
  transformer: EntityTransformer<T>,
  save: (entity: T) => Promise<any>,
): Promise<void> {
  if (multiple === 'true') {
    const entities = await transformer.fromZipToMany(await JSZip.loadAsync(file.buffer));
    await Promise.all(entities.map((contest) => save(contest)));
  } else {
    const entity = await transformer.fromZip(await JSZip.loadAsync(file.buffer));
    await save(entity);
  }
}

export async function zipEntities<T>(
  id: number | undefined,
  zipName: string,
  transformer: EntityTransformer<T>,
  entities: T | T[],
  response: Response,
): Promise<void> {
  const zip = new JSZip();
  if (id) await transformer.toZip(entities as T, zip);
  else await transformer.manyToZip(entities as T[], zip);
  response.attachment(zipName);
  zip.generateNodeStream().pipe(response);
}
