import classNames from 'classnames';
import React from 'react';
import { dateComparator, formatBytes, formatRestTime } from '../../../../core/helpers';
import { Judging, Submission } from '../../../../core/models';
import { resultMap } from '../../../../core/types';

const SubmissionViewDetails: React.FC<{
  submission: Submission;
}> = ({ submission }) => {
  return (
    <div className="border border-gray-300 rounded-md shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="divide-x">
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Team
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Problem
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Language
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Result
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Memory
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Sent
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-700 uppercase tracking-wider">
              Judged
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-y-200">
          {submission.judgings
            .slice()
            .sort(dateComparator<Judging>('startTime', true))
            .map((judging, index) => (
              <tr
                key={`judging-${judging.id}`}
                className={classNames('divide-x text-center', {
                  'text-gray-400': index > 0,
                })}
              >
                <td className="px-6 py-4">{submission.id}</td>
                <td className="px-6 py-4">{submission.team.name}</td>
                <td className="px-6 py-4">{submission.problem.name}</td>
                <td className="px-6 py-4">{submission.language.name}</td>
                <td className="px-6 py-4">
                  <b
                    className={classNames({
                      'text-green-600': judging?.result === 'AC',
                      'text-red-600': judging?.result && judging.result !== 'AC',
                      'text-gray-600': !judging?.result || index,
                    })}
                  >
                    {resultMap[judging?.result ?? 'PD']}
                  </b>
                </td>
                <td className="px-6 py-4">
                  {judging
                    ? `${Math.floor(
                        judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runTime), 0) *
                          1000,
                      )} ms`
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  {judging
                    ? formatBytes(
                        judging.runs.reduce<number>(
                          (pMax, run) => Math.max(pMax, run.runMemory),
                          0,
                        ) * 1024,
                      )
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  {formatRestTime(
                    (new Date(submission.submitTime).getTime() -
                      new Date(submission.contest.startTime).getTime()) /
                      1000,
                  )}
                </td>
                <td className="px-6 py-4">
                  {judging
                    ? formatRestTime(
                        (new Date(judging.startTime).getTime() -
                          new Date(submission.contest.startTime).getTime()) /
                          1000,
                      )
                    : '-'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionViewDetails;
