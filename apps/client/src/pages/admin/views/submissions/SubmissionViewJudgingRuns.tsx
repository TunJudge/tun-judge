import { EyeIcon, FlaskConicalIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { Button, Flex, cn } from 'tw-react-components';

import { JudgingRunResult } from '@prisma/client';

import { CodeEditorSheet, DiffValues, DiffViewerSheet, PageTemplate } from '@core/components';
import { JUDGING_RESULT_LABELS } from '@core/constants';
import { useDownloadedFile } from '@core/hooks';
import { downloadFile, formatBytes } from '@core/utils';

import { Judging, JudgingRun } from './SubmissionView';

export const SubmissionsViewJudgingRuns: FC<{ judging?: Judging }> = ({ judging }) => {
  const [fileNameToBeViewed, setFileNameToBeViewed] = useState<string>();
  const [diffData, setDiffData] = useState<DiffValues>();

  const loadOutputFileAndShowDiff = async (run: JudgingRun) => {
    if (!run.runOutputFileName) return;

    setDiffData({
      left: {
        title: 'Team output',
        value: await downloadFile(run.runOutputFileName),
      },
      right: {
        title: 'Judge output',
        value: await downloadFile(run.testcase.outputFileName),
      },
    });
  };

  return (
    <>
      {judging?.runs.map((run) => (
        <PageTemplate
          key={run.id}
          className="overflow-visible rounded-lg bg-slate-200 dark:bg-gray-800 [&>div>div>button]:whitespace-nowrap"
          icon={FlaskConicalIcon}
          title={
            <Flex className="gap-4 text-base" align="center">
              <span className="text-lg font-medium">Testcase #{run.testcase.rank}</span>
              <b
                className={cn({
                  'text-green-600': run.result === 'ACCEPTED',
                  'text-red-600': run.result && run.result !== 'ACCEPTED',
                  'text-gray-600': !run.result,
                })}
              >
                {JUDGING_RESULT_LABELS[run.result ?? 'PENDING']}
              </b>
              <div>Time: {Math.floor(run.runTime * 1000)} ms</div>
              <div>Memory: {formatBytes(run.runMemory * 1024)}</div>
            </Flex>
          }
          actions={
            <>
              <Button
                color="green"
                prefixIcon={EyeIcon}
                onClick={() => setFileNameToBeViewed(run.testcase.inputFileName)}
              >
                Input
              </Button>
              <Button
                color="red"
                prefixIcon={EyeIcon}
                onClick={() =>
                  run.runOutputFileName && setFileNameToBeViewed(run.runOutputFileName)
                }
              >
                Team Output
              </Button>
              <Button
                color="yellow"
                prefixIcon={EyeIcon}
                onClick={() => loadOutputFileAndShowDiff(run)}
              >
                Difference
              </Button>
              <Button
                color="blue"
                prefixIcon={EyeIcon}
                onClick={() => setFileNameToBeViewed(run.testcase.outputFileName)}
              >
                Reference Output
              </Button>
            </>
          }
          isSubSection
          fullHeight={false}
        >
          {judging.result === 'SYSTEM_ERROR' && (
            <OutputSection title="System output" payload={judging.systemError} />
          )}
          {runHasAnyOfResults(run, ['ACCEPTED', 'WRONG_ANSWER']) && (
            <OutputSection title="Checker output" fileName={run.checkerOutputFileName} />
          )}
          {runHasAnyOfResults(run, [
            'RUNTIME_ERROR',
            'TIME_LIMIT_EXCEEDED',
            'MEMORY_LIMIT_EXCEEDED',
          ]) && <OutputSection title="Error output" fileName={run.errorOutputFileName} />}
        </PageTemplate>
      ))}

      <CodeEditorSheet
        lang="text"
        fileName={fileNameToBeViewed}
        onClose={() => setFileNameToBeViewed(undefined)}
        readOnly
      />
      <DiffViewerSheet values={diffData} onClose={() => setDiffData(undefined)} />
    </>
  );
};

const OutputSection: FC<{
  title: string;
  payload?: string | null;
  fileName?: string | null;
}> = ({ title, payload, fileName }) => {
  const content = useDownloadedFile(fileName ?? undefined, payload ?? undefined);

  return (
    <Flex className="gap-1" direction="column" fullWidth>
      <b>{title}</b>
      <pre
        className={cn(
          'border-border mt-1 max-h-20 min-h-20 w-full overflow-auto rounded-md border p-2',
          {
            'text-black dark:text-white': !!content,
            'text-gray-600 dark:text-gray-400': !content,
          },
        )}
      >
        <code>{content ?? 'No Output'}</code>
      </pre>
    </Flex>
  );
};

function runHasAnyOfResults(run: JudgingRun, results: JudgingRunResult[]) {
  return results.includes(run.result ?? 'PENDING');
}
