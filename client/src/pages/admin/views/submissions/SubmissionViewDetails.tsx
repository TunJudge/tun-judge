import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { dateComparator, formatBytes, formatRestTime } from '../../../../core/helpers';
import { Judging, Submission } from '../../../../core/models';
import { resultMap } from '../../../../core/types';

const SubmissionViewDetails: React.FC<{
  submission: Submission;
}> = ({ submission }) => {
  return (
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
        {submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .map((judging, index) => (
            <Table.Row key={`judging-${judging.id}`} disabled={index > 0}>
              <Table.Cell>{submission.id}</Table.Cell>
              <Table.Cell>{submission.team.name}</Table.Cell>
              <Table.Cell>{submission.problem.name}</Table.Cell>
              <Table.Cell>{submission.language.name}</Table.Cell>
              <Table.Cell>
                <b
                  style={{
                    color: judging?.result ? (judging.result === 'AC' ? 'green' : 'red') : 'grey',
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
                      judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runMemory), 0) *
                        1024,
                    )
                  : '-'}
              </Table.Cell>
              <Table.Cell>
                {formatRestTime(
                  (new Date(submission.submitTime).getTime() -
                    new Date(submission.contest.startTime).getTime()) /
                    1000,
                )}
              </Table.Cell>
              <Table.Cell>
                {judging
                  ? formatRestTime(
                      (new Date(judging.startTime).getTime() -
                        new Date(submission.contest.startTime).getTime()) /
                        1000,
                    )
                  : '-'}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default SubmissionViewDetails;
