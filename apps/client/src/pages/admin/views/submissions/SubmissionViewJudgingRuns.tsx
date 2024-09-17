import { EyeIcon } from '@heroicons/react/outline';
import {
  DiffValues,
  DiffViewerDialog,
  RunContentDialog,
  TestcaseContentDialog,
} from '@shared/dialogs';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { formatBytes } from '@core/helpers';
import { Judging, JudgingRun, Testcase } from '@core/models';
import { SubmissionsStore, TestcasesStore, useStore } from '@core/stores';
import { resultMap } from '@core/types';

const SubmissionsViewJudgingRuns: React.FC<{ judging?: Judging }> = observer(({ judging }) => {
  const submissionsStore = useStore<SubmissionsStore>('submissionsStore');
  const testcasesStore = useStore<TestcasesStore>('testcasesStore');

  const [testcaseViewData, setTestcaseViewData] = useState<{
    testcase: Testcase | undefined;
    field: 'input' | 'output';
  }>({ testcase: undefined, field: 'input' });
  const [runViewData, setRunViewData] = useState<JudgingRun>();
  const [diffData, setDiffData] = useState<DiffValues>();

  const loadOutputFileAndShowDiff = async (run: JudgingRun) => {
    if (run.testcase.id && !run.testcase.output.content) {
      run.testcase.output.content = await testcasesStore.fetchContent(run.testcase.id, 'output');
    }
    if (run.id && !run.runOutput.content) {
      run.runOutput.content = await submissionsStore.fetchRunContent(run.id);
    }

    setDiffData({
      left: {
        title: 'Team output',
        value: atob(run.runOutput.content.payload),
      },
      right: {
        title: 'Judge output',
        value: atob(run.testcase.output.content.payload),
      },
    });
  };

  return (
    <>
      {judging?.runs?.map((run) => (
        <div
          key={`run-${run.id}`}
          className="flex flex-col divide-y rounded-md bg-white shadow dark:divide-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-x-8">
              <div className="text-lg font-medium">Testcase {run.testcase.id}</div>
              <div>
                <b
                  className={classNames({
                    'text-green-600': run.result === 'AC',
                    'text-red-600': run.result && run.result !== 'AC',
                    'text-gray-600': !run.result,
                  })}
                >
                  {resultMap[run.result ?? 'PD']}
                </b>
              </div>
              <div>Time: {Math.floor(run.runTime * 1000)}ms</div>
              <div>Memory: {formatBytes(run.runMemory * 1024)}</div>
            </div>
            <div className="flex select-none gap-2">
              <div
                className="flex cursor-pointer gap-x-1 rounded-md border border-green-600 p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'input' })}
              >
                <EyeIcon className="h-6 w-6" />
                Input
              </div>
              <div
                className={classNames(
                  'flex gap-x-1 rounded-md border border-red-600 p-2 text-red-600',
                  {
                    'opacity-50': !run.runOutput.size,
                    'cursor-pointer hover:bg-red-50 dark:hover:bg-red-900': run.runOutput.size,
                  },
                )}
                onClick={() => (run.runOutput.size ? setRunViewData(run) : undefined)}
              >
                <EyeIcon className="h-6 w-6" />
                Team Output
              </div>
              <div
                className="flex cursor-pointer gap-x-1 rounded-md border border-yellow-600 p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900"
                onClick={() => loadOutputFileAndShowDiff(run)}
              >
                <EyeIcon className="h-6 w-6" />
                Difference
              </div>
              <div
                className="flex cursor-pointer gap-x-1 rounded-md border border-blue-600 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'output' })}
              >
                <EyeIcon className="h-6 w-6" />
                Reference Output
              </div>
            </div>
          </div>
          <div className="p-3">
            {judging.result === 'SE' && (
              <OutputSection
                title="System output"
                color={!judging.systemError ? 'gray' : 'black'}
                payload={judging.systemError}
              />
            )}
            {['AC', 'WA'].includes(run.result) && (
              <OutputSection
                title="Checker output"
                color={!run.checkerOutput ? 'gray' : 'black'}
                payload={atob(run.checkerOutput.content.payload)}
              />
            )}
            {['RE', 'TLE', 'MLE'].includes(run.result) && (
              <OutputSection
                title="Error output"
                color={!run.errorOutput ? 'gray' : 'black'}
                payload={atob(run.errorOutput.content.payload)}
              />
            )}
          </div>
        </div>
      ))}
      <TestcaseContentDialog
        testcase={testcaseViewData.testcase}
        field={testcaseViewData.field}
        onClose={() => setTestcaseViewData({ testcase: undefined, field: 'input' })}
      />
      <RunContentDialog run={runViewData} onClose={() => setRunViewData(undefined)} />
      <DiffViewerDialog values={diffData} onClose={() => setDiffData(undefined)} />
    </>
  );
});

export default SubmissionsViewJudgingRuns;

const OutputSection: React.FC<{
  title: string;
  color: 'gray' | 'black';
  payload?: string;
}> = ({ title, color, payload }) => (
  <div className="flex flex-col gap-y-1">
    <b>{title}</b>
    <pre
      className={classNames('mt-1 max-h-20 overflow-auto rounded-md border border-gray-500 p-2', {
        'text-black dark:text-white': color === 'black',
        'text-gray-600 dark:text-gray-400': color === 'gray',
      })}
    >
      <code>{payload ?? 'No Output'}</code>
    </pre>
  </div>
);
