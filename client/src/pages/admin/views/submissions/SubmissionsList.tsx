import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { Judging, Submission, Testcase } from '../../../../core/models';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import { formatRestTime, isEmpty } from '../../../../core/helpers';
import { Button, Form, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { resultMap } from '../../../../core/types';
import { Filters } from '../../../../core/stores/SubmissionsStore';

let interval: NodeJS.Timeout | undefined = undefined;

const SubmissionsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    profile,
    submissionsStore: { data, total, page, setPage, filters, setFilters, fetchAll, claim, unClaim },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAll();
    interval && clearInterval(interval);
    interval = setInterval(() => fetchAll(), 2000);
    return () => {
      interval && clearInterval(interval);
    };
  }, [page, filters, fetchAll]);

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) => (
        <a className="cursor-pointer" onClick={() => history.push(`/submissions/${submission.id}`)}>
          {formatRestTime(
            (new Date(submission.submitTime).getTime() -
              new Date(currentContest?.startTime ?? 0).getTime()) /
              1000,
          )}
        </a>
      ),
    },
    {
      header: 'Team',
      field: 'team',
      render: (submission) => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'problem',
      render: (submission) => submission.problem.name,
    },
    {
      header: 'Language',
      field: 'language',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => {
        const judging = submission.judgings.find((j) => j.valid && j.endTime);
        return (
          <b style={{ color: judging ? (judging.result === 'AC' ? 'green' : 'red') : 'grey' }}>
            {judging?.result ? resultMap[judging.result] : 'Pending'}
          </b>
        );
      },
    },
    {
      header: 'Verified by',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .shift();
        return judging && judging.result ? (
          judging.verified ? (
            `Yes by ${judging.juryMember.username}`
          ) : judging.juryMember ? (
            judging.juryMember.username === profile?.username ? (
              <Button
                onClick={async () => {
                  await unClaim(submission.id);
                  await fetchAll();
                }}
              >
                UnClaim
              </Button>
            ) : (
              `Claimed by ${judging.juryMember?.username}`
            )
          ) : (
            <Button
              onClick={async () => {
                await claim(submission.id);
                history.push(`/submissions/${submission.id}`);
              }}
            >
              Claim
            </Button>
          )
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Test Results',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        return submission.problem.testcases
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((testcase) => (
            <Icon
              key={`${submission.id}-${testcase.id}`}
              name="check square"
              color={isTestcaseSolved(testcase, judging.length ? judging[0] : undefined)}
            />
          ));
      },
    },
  ];

  return (
    <ListPage<Submission>
      header="Submissions"
      data={data}
      columns={columns}
      filters={<SubmissionsFilters filters={filters} onChange={setFilters} />}
      pagination={
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="8">
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon onClick={() => page && setPage(page - 1)}>
                  <Icon name="chevron left" />
                </Menu.Item>
                {new Array(Math.ceil(total / 10)).fill(0).map((_, index) => (
                  <Menu.Item
                    key={`page-${index}`}
                    as="a"
                    onClick={() => setPage(index)}
                    active={page === index}
                  >
                    {index + 1}
                  </Menu.Item>
                ))}
                <Menu.Item
                  as="a"
                  icon
                  onClick={() => page + 1 < Math.ceil(total / 10) && setPage(page + 1)}
                >
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      }
      onRefresh={fetchAll}
      withoutActions
    />
  );
});

export default SubmissionsList;

const SubmissionsFilters: React.FC<{
  filters: Partial<Filters>;
  onChange?: (filters: Partial<Filters>) => void;
}> = observer(({ filters, onChange }) => {
  const {
    languagesStore: { fetchAll: fetchAllLanguages, data: languages },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAllLanguages();
  }, [fetchAllLanguages]);

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Dropdown
            label="Filter by problem"
            fluid
            multiple
            selection
            clearable
            value={filters.problems ?? []}
            placeholder="All Problems"
            options={
              currentContest?.problems.map(({ shortName, problem }) => ({
                key: problem.id,
                text: `${shortName} - ${problem.name}`,
                value: problem.id,
              })) ?? []
            }
            onChange={(_, { value }) =>
              onChange && onChange({ ...filters, problems: value as number[] })
            }
          />
          <Form.Dropdown
            label="Filter by team"
            fluid
            multiple
            selection
            clearable
            value={filters.teams ?? []}
            placeholder="All Teams"
            options={
              currentContest?.teams.map((team) => ({
                key: team.id,
                text: team.name,
                value: team.id,
              })) ?? []
            }
            onChange={(_, { value }) =>
              onChange && onChange({ ...filters, teams: value as number[] })
            }
          />
          <Form.Dropdown
            label="Filter by language"
            fluid
            multiple
            selection
            clearable
            value={filters.languages ?? []}
            placeholder="All Languages"
            options={languages.map((language) => ({
              key: language.id,
              text: language.name,
              value: language.id,
            }))}
            onChange={(_, { value }) =>
              onChange && onChange({ ...filters, languages: value as number[] })
            }
          />
          <Form.Dropdown
            label="Filter by status"
            fluid
            selection
            clearable
            value={filters.notJudged ? 'notJudged' : filters.notVerified ? 'notVerified' : ''}
            placeholder="All"
            options={[
              {
                key: 'notJudged',
                text: 'Not Judged',
                value: 'notJudged',
              },
              {
                key: 'notVerified',
                text: 'Not Verified',
                value: 'notVerified',
              },
            ]}
            onChange={(_, { value }) =>
              onChange &&
              onChange({
                ...filters,
                notJudged: !isEmpty(value) && value === 'notJudged',
                notVerified: !isEmpty(value) && value === 'notVerified',
              })
            }
          />
        </Form.Group>
      </Form>
    </Segment>
  );
});

function isTestcaseSolved(testcase: Testcase, judging?: Judging): 'grey' | 'green' | 'red' {
  if (!judging) return 'grey';
  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);
  return !judgeRun ? 'grey' : judgeRun.result === 'AC' ? 'green' : 'red';
}
