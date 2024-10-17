import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { useFindFirstProblem } from '@models';

import { TestcasesList } from './testcases/TestcasesList';

export type Problem = Prisma.ProblemGetPayload<{
  include: { testcases: { include: { inputFile: true; outputFile: true } } };
}>;

export const ProblemView: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: problem } = useFindFirstProblem({
    where: { id: parseInt(id ?? '-1') },
    include: { testcases: { include: { inputFile: true, outputFile: true } } },
  });

  return !problem?.id ? (
    <Spinner className="rounded-md shadow" />
  ) : (
    <div className="grid h-full grid-cols-2 overflow-hidden p-4 pb-0 pl-0 dark:text-white">
      <div className="flex flex-col overflow-hidden">
        <div className="px-4">
          <div className="divide-y rounded-md bg-white shadow dark:divide-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between p-3">
              <div className="text-lg font-medium">{`Problem '${problem.name}'`}</div>
              <div
                className="cursor-pointer rounded bg-blue-500 p-2 px-3 text-white hover:bg-blue-400"
                // onClick={() => rejudge(problem.id!)}
              >
                Rejudge
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-md border dark:border-gray-700">
                <table className="min-w-full">
                  <tbody className="divide-y dark:divide-gray-700">
                    <tr className="divide-x dark:divide-gray-700">
                      <td className="p-2">ID</td>
                      <td className="p-2">{problem.id}</td>
                    </tr>
                    <tr className="divide-x bg-gray-100 dark:divide-gray-800 dark:bg-gray-700">
                      <td className="p-2">Name</td>
                      <td className="p-2">{problem.name}</td>
                    </tr>
                    <tr className="divide-x dark:divide-gray-700">
                      <td className="p-2">Time limit</td>
                      <td className="p-2">{problem.timeLimit} s</td>
                    </tr>
                    <tr className="divide-x bg-gray-100 dark:divide-gray-800 dark:bg-gray-700">
                      <td className="p-2">Memory limit</td>
                      <td className="p-2">{problem.memoryLimit} Kb</td>
                    </tr>
                    <tr className="divide-x dark:divide-gray-700">
                      <td className="p-2">Output limit</td>
                      <td className="p-2">{problem.outputLimit} Kb</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden p-4">
          <TestcasesList problem={problem} />
        </div>
      </div>
      <div className="flex flex-col pb-4">
        <div className="h-full rounded-md bg-white p-4 shadow dark:bg-gray-800">
          <embed
            className="rounded-lg"
            src={`/files/${problem.statementFileName}`}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};
