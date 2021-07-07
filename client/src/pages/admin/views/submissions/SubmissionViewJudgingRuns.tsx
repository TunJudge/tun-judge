import { EyeIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { dateComparator, formatBytes } from '../../../../core/helpers';
import { Judging, Submission, Testcase } from '../../../../core/models';
import { JudgingRun } from '../../../../core/models/judging-run.model';
import { rootStore } from '../../../../core/stores/RootStore';
import { resultMap } from '../../../../core/types';
import {
  DiffValues,
  DiffViewerDialog,
  RunContentDialog,
  TestcaseContentDialog,
} from '../../../shared/dialogs';

const SubmissionsViewJudgingRuns: React.FC<{ submission: Submission }> = observer(
  ({ submission }) => {
    const judging = submission.judgings
      .slice()
      .sort(dateComparator<Judging>('startTime', true))
      .shift();
    const [testcaseViewData, setTestcaseViewData] = useState<{
      testcase: Testcase | undefined;
      field: 'input' | 'output';
    }>({ testcase: undefined, field: 'input' });
    const [runViewData, setRunViewData] = useState<JudgingRun>();
    const [diffData, setDiffData] = useState<DiffValues>();

    const loadOutputFileAndShowDiff = async (run: JudgingRun) => {
      if (run.testcase.id && !run.testcase.output.content) {
        run.testcase.output.content = await rootStore.testcasesStore.fetchContent(
          run.testcase.id,
          'output',
        );
      }
      if (run.id && !run.runOutput.content) {
        run.runOutput.content = await rootStore.submissionsStore.fetchRunContent(run.id);
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
            className="flex flex-col bg-white divide-y border shadow rounded-md"
          >
            <div className="flex p-3 items-center justify-between">
              <div className="flex items-center gap-x-8">
                <div className="text-lg font-medium">Testcase {run.testcase.id}</div>
                <div>
                  <b
                    className={`text-${
                      judging?.result ? (judging.result === 'AC' ? 'green' : 'red') : 'grey'
                    }-600`}
                  >
                    {resultMap[run.result ?? 'PD']}
                  </b>
                </div>
                <div>Time: {Math.floor(run.runTime * 1000)}ms</div>
                <div>Memory: {formatBytes(run.runMemory * 1024)}</div>
              </div>
              <div className="flex select-none">
                <div
                  className="flex gap-x-1 p-2 text-green-600 border border-r-0 border-green-600 rounded-l-md cursor-pointer hover:bg-green-50"
                  onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'input' })}
                >
                  <EyeIcon className="w-6 h-6" />
                  Input
                </div>
                <div
                  className={classNames(
                    'flex gap-x-1 p-2 text-red-600 border border-r-0 border-red-600',
                    {
                      'opacity-50': !run.runOutput.size,
                      'cursor-pointer hover:bg-red-50': run.runOutput.size,
                    },
                  )}
                  onClick={() => (run.runOutput.size ? setRunViewData(run) : undefined)}
                >
                  <EyeIcon className="w-6 h-6" />
                  Team Output
                </div>
                <div
                  className="flex gap-x-1 p-2 text-yellow-600 border border-r-0 border-yellow-600 cursor-pointer hover:bg-yellow-50"
                  onClick={() => loadOutputFileAndShowDiff(run)}
                >
                  <EyeIcon className="w-6 h-6" />
                  Difference
                </div>
                <div
                  className="flex gap-x-1 p-2 text-blue-600 border border-blue-600 rounded-r-md cursor-pointer hover:bg-blue-50"
                  onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'output' })}
                >
                  <EyeIcon className="w-6 h-6" />
                  Reference Output
                </div>
              </div>
            </div>
            <div className="p-3">
              {judging?.result === 'SE' && (
                <OutputSection
                  title="System output"
                  color={!judging.systemError ? 'grey' : 'black'}
                  payload={judging.systemError}
                />
              )}
              {['AC', 'WA'].includes(run.result) && (
                <OutputSection
                  title="Checker output"
                  color={!run.checkerOutput ? 'grey' : 'black'}
                  payload={atob(run.checkerOutput.content.payload)}
                />
              )}
              {['RE', 'TLE', 'MLE'].includes(run.result) && (
                <OutputSection
                  title="Error output"
                  color={!run.errorOutput ? 'grey' : 'black'}
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
  },
);

export default SubmissionsViewJudgingRuns;

const OutputSection: React.FC<{
  title: string;
  color: 'grey' | 'black';
  payload?: string;
}> = ({ title, color, payload }) => (
  <div className="flex flex-col gap-y-1">
    <b>{title}</b>
    <pre
      style={{
        padding: '0.3rem',
        border: '0.5px grey solid',
        borderRadius: '.28571429rem',
        margin: 0,
        marginTop: 4,
        maxHeight: '300px',
        overflow: 'auto',
      }}
    >
      <code style={{ color: color }}>{payload ?? 'No Output'}</code>
    </pre>
  </div>
);
