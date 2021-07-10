import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import Spinner from '../../../shared/Spinner';
import TestcasesList from './testcases/TestcasesList';

const ProblemView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const {
    problemsStore: { item, fetchById, rejudge },
  } = rootStore;

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchById]);

  return !item.id ? (
    <Spinner />
  ) : (
    <div className="grid grid-cols-2 gap-4 overflow-hidden h-full dark:text-white">
      <div className="flex flex-col gap-y-4 overflow-hidden">
        <div className="bg-white divide-y border shadow rounded-md dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
          <div className="flex p-3 items-center justify-between">
            <div className="text-lg font-medium">{`Problem '${item.name}'`}</div>
            <div
              className="text-white p-2 px-3 bg-blue-500 hover:bg-blue-400 rounded cursor-pointer"
              onClick={() => rejudge(item.id!)}
            >
              Rejudge
            </div>
          </div>
          <div className="p-4">
            <div className="border rounded-md dark:border-gray-700">
              <table className="min-w-full">
                <tbody className="divide-y dark:divide-gray-700">
                  <tr className="divide-x dark:divide-gray-700">
                    <td className="p-2">ID</td>
                    <td className="p-2">{item.id}</td>
                  </tr>
                  <tr className="divide-x bg-gray-100 dark:bg-gray-700 dark:divide-gray-800">
                    <td className="p-2">Name</td>
                    <td className="p-2">{item.name}</td>
                  </tr>
                  <tr className="divide-x dark:divide-gray-700">
                    <td className="p-2">Time limit</td>
                    <td className="p-2">{item.timeLimit} s</td>
                  </tr>
                  <tr className="divide-x bg-gray-100 dark:bg-gray-700 dark:divide-gray-800">
                    <td className="p-2">Memory limit</td>
                    <td className="p-2">{item.memoryLimit} Kb</td>
                  </tr>
                  <tr className="divide-x dark:divide-gray-700">
                    <td className="p-2">Output limit</td>
                    <td className="p-2">{item.outputLimit} Kb</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <TestcasesList problem={item as Problem} />
      </div>
      <div className="bg-white p-4 border shadow rounded-md dark:bg-gray-800 dark:border-gray-700">
        <embed
          src={`data:${item.file?.type};base64,${item.file?.content.payload}`}
          type={item.file?.type}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
});

export default ProblemView;
