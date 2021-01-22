import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { RouteChildrenProps, useHistory } from 'react-router-dom';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import {
  dateComparator,
  formatBytes,
  formatRestTime,
  isSubmissionClaimedByMe,
} from '../../../../core/helpers';
import { Judging, Testcase } from '../../../../core/models';
import { JudgingRun } from '../../../../core/models/judging-run.model';
import { rootStore } from '../../../../core/stores/RootStore';
import { languageMap, resultMap } from '../../../../core/types';
import CodeEditor from '../../../shared/CodeEditor';
import Spinner from '../../../shared/Spinner';
import TestcaseContentView from '../problems/testcases/TestcaseContentView';
import RunContentView from './RunContentView';

const SubmissionsView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const history = useHistory();
  const [judging, setJudging] = useState<Judging>();
  const [testcaseViewData, setTestcaseViewData] = useState<{
    testcase: Testcase | undefined;
    field: 'input' | 'output';
  }>({ testcase: undefined, field: 'input' });
  const [runViewData, setRunViewData] = useState<JudgingRun>();
  const {
    profile,
    updatesCount: { judgings },
    submissionsStore: {
      item,
      cleanItem,
      fetchById,
      ignore,
      unIgnore,
      rejudge,
      claim,
      unClaim,
      markVerified,
    },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/submissions'));
  }, [fetchById, cleanItem, judgings, match]);

  useEffect(() => {
    if (item) {
      setJudging(item.judgings.slice().sort(dateComparator<Judging>('startTime', true)).shift());
    }
  }, [item]);

  useEffect(() => {
    return cleanItem;
  }, [cleanItem]);

  return !item ? (
    <Spinner />
  ) : (
    <>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>Submission {item.id}</Header>
        </Menu.Item>
        <Menu.Item position="right">
          {judging && judging.result && (
            <Button
              basic
              color="linkedin"
              className="mr-2"
              onClick={async () => {
                await (item.valid ? ignore : unIgnore)(item.id);
                await fetchById(item?.id);
              }}
            >
              {item.valid ? 'Ignore' : 'UnIgnore'}
            </Button>
          )}
          {judging && judging.result && judging.verified && (
            <Button
              basic
              color="red"
              className="mr-2"
              onClick={async () => {
                await rejudge(item.id);
                await fetchById(item?.id);
              }}
            >
              Rejudge
            </Button>
          )}
          {judging && judging.result && !judging.verified && (
            <>
              <Button
                basic
                color="blue"
                className="mr-2"
                onClick={async () => {
                  if (isSubmissionClaimedByMe(judging, profile)) {
                    await unClaim(item?.id);
                  } else {
                    await claim(item?.id);
                  }
                  await fetchById(item?.id);
                }}
              >
                {isSubmissionClaimedByMe(judging, profile) ? 'UnClaim' : 'Claim'}
              </Button>
              <Button
                basic
                color="green"
                className="mr-2"
                onClick={async () => {
                  await markVerified(item?.id);
                  history.push('/submissions');
                }}
              >
                Mark Verified
              </Button>
            </>
          )}
          <Button color="blue" icon onClick={() => fetchById(item?.id)}>
            <Icon name="refresh" />
          </Button>
        </Menu.Item>
      </Segment>
      <Table striped textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="1">#</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Problem</Table.HeaderCell>
            <Table.HeaderCell>Language</Table.HeaderCell>
            <Table.HeaderCell>Result</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Memory</Table.HeaderCell>
            <Table.HeaderCell>Sent</Table.HeaderCell>
            <Table.HeaderCell>Judged</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {item.judgings
            .slice()
            .sort(dateComparator<Judging>('startTime', true))
            .map((judging, index) => (
              <Table.Row key={`judging-${judging.id}`} disabled={index > 0}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.team.name}</Table.Cell>
                <Table.Cell>{item.problem.name}</Table.Cell>
                <Table.Cell>{item.language.name}</Table.Cell>
                <Table.Cell>
                  <b
                    style={{
                      color:
                        judging && judging.result
                          ? judging.result === 'AC'
                            ? 'green'
                            : 'red'
                          : 'grey',
                    }}
                  >
                    {resultMap[judging?.result ?? 'PD']}
                  </b>
                </Table.Cell>
                <Table.Cell>
                  {judging
                    ? `${Math.floor(
                        judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runTime), 0) *
                          1000,
                      )} ms`
                    : '-'}
                </Table.Cell>
                <Table.Cell>
                  {judging
                    ? formatBytes(
                        judging.runs.reduce<number>(
                          (pMax, run) => Math.max(pMax, run.runMemory),
                          0,
                        ) * 1024,
                      )
                    : '-'}
                </Table.Cell>
                <Table.Cell>
                  {formatRestTime(
                    (new Date(item.submitTime).getTime() -
                      new Date(currentContest?.startTime ?? 0).getTime()) /
                      1000,
                  )}
                </Table.Cell>
                <Table.Cell>
                  {judging
                    ? formatRestTime(
                        (new Date(judging.startTime).getTime() -
                          new Date(currentContest?.startTime ?? 0).getTime()) /
                          1000,
                      )
                    : '-'}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <Segment.Group>
        <Segment as={Header}>Code Source</Segment>
        <Segment>
          <CodeEditor
            value={atob(item.file.content.payload)}
            lang={languageMap[item.language.name]}
            readOnly
          />
        </Segment>
      </Segment.Group>
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
                <Button
                  basic
                  color="blue"
                  onClick={() => setTestcaseViewData({ testcase: run.testcase, field: 'output' })}
                >
                  <Icon name="eye" />
                  Reference Output
                </Button>
                <Button basic color="red" onClick={() => setRunViewData(run)}>
                  <Icon name="eye" />
                  Team Output
                </Button>
              </Button.Group>
            </Menu.Item>
          </Segment>
          <Segment>
            {['AC', 'WA'].includes(judging?.result) && (
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
            {['RE', 'TLE', 'MLE'].includes(judging?.result) && (
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
      {testcaseViewData.testcase && (
        <TestcaseContentView
          testcase={testcaseViewData.testcase}
          field={testcaseViewData.field}
          dismiss={() => setTestcaseViewData({ testcase: undefined, field: 'input' })}
        />
      )}
      {runViewData && (
        <RunContentView run={runViewData} dismiss={() => setRunViewData(undefined)} />
      )}
    </>
  );
});

export default SubmissionsView;
