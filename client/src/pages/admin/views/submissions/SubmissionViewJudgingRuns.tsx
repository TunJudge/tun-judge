import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, Header, Icon, Menu, Segment } from 'semantic-ui-react';
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
          <Segment.Group key={`run-${run.id}`}>
            <Segment as={Menu} style={{ padding: 0 }} borderless>
              <Menu.Item as={Header}>Testcase {run.testcase.id}</Menu.Item>
              <Menu.Item>
                <b
                  style={{
                    color: run.result ? (run.result === 'AC' ? 'green' : 'red') : 'grey',
                  }}
                >
                  {resultMap[run.result ?? 'PD']}
                </b>
              </Menu.Item>
              <Menu.Item>Time: {Math.floor(run.runTime * 1000)}ms</Menu.Item>
              <Menu.Item>Memory: {formatBytes(run.runMemory * 1024)}</Menu.Item>
              <Menu.Item style={{ paddingTop: '.6rem', paddingBottom: '.6rem' }} position="right">
                <Button.Group size="tiny">
                  <Button
                    basic
                    color="green"
                    onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'input' })}
                  >
                    <Icon name="eye" />
                    Input
                  </Button>
                  <Button basic color="red" onClick={() => setRunViewData(run)}>
                    <Icon name="eye" />
                    Team Output
                  </Button>
                  <Button basic color="orange" onClick={() => loadOutputFileAndShowDiff(run)}>
                    <Icon name="eye" />
                    Difference
                  </Button>
                  <Button
                    basic
                    color="blue"
                    onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'output' })}
                  >
                    <Icon name="eye" />
                    Reference Output
                  </Button>
                </Button.Group>
              </Menu.Item>
            </Segment>
            <Segment>
              {['AC', 'WA'].includes(judging!.result) && (
                <>
                  <b>Checker output</b>
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
                    <code style={{ color: !run.checkerOutput ? 'grey' : 'black' }}>
                      {run.checkerOutput
                        ? atob(run.checkerOutput?.content.payload ?? '')
                        : 'No Output'}
                    </code>
                  </pre>
                </>
              )}
              {['RE', 'TLE', 'MLE'].includes(judging!.result) && (
                <>
                  <b>Error output</b>
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
                    <code style={{ color: !run.errorOutput ? 'grey' : 'black' }}>
                      {run.errorOutput ? atob(run.errorOutput?.content.payload ?? '') : 'No Output'}
                    </code>
                  </pre>
                </>
              )}
            </Segment>
          </Segment.Group>
        ))}
        <TestcaseContentDialog
          testcase={testcaseViewData.testcase}
          field={testcaseViewData.field}
          onClose={() => setTestcaseViewData({ testcase: undefined, field: 'input' })}
        />
        <RunContentDialog run={runViewData} dismiss={() => setRunViewData(undefined)} />
        <DiffViewerDialog values={diffData} onClose={() => setDiffData(undefined)} />
      </>
    );
  },
);

export default SubmissionsViewJudgingRuns;
