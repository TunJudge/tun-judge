import React, { useEffect } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';
import { rootStore } from '../../core/stores/RootStore';
import { observer } from 'mobx-react';
import { formatRestTime } from '../../core/helpers';
import { Contest, ScoreCache, Team } from '../../core/models';

let interval: NodeJS.Timeout | undefined = undefined;

const Scoreboard: React.FC = observer(() => {
  const {
    publicStore: { currentContest, scoreCaches, fetchScoreCaches },
  } = rootStore;

  useEffect(() => {
    currentContest?.id && fetchScoreCaches(currentContest.id);
    interval && clearInterval(interval);
    interval = setInterval(() => currentContest?.id && fetchScoreCaches(currentContest.id), 1000);
    return () => {
      interval && clearInterval(interval);
    };
  }, [currentContest, fetchScoreCaches]);

  return !currentContest ? (
    <>No Active Contest</>
  ) : (
    <Container textAlign="center">
      <Header>Scoreboard of {currentContest?.name}</Header>
      <Table textAlign="center" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="1">Rank</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell width="1">Score</Table.HeaderCell>
            {currentContest.problems
              .slice()
              .sort((a, b) => a.shortName.localeCompare(b.shortName))
              .map((problem) => (
                <Table.HeaderCell key={problem.shortName}>{problem.shortName}</Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentContest.teams.map((team, index) => (
            <Table.Row key={`team-${team.id}`}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell textAlign="left">{team.name}</Table.Cell>
              <Table.Cell>
                {currentContest && getTeamScore(currentContest, team, scoreCaches)}
              </Table.Cell>
              {currentContest.problems
                .slice()
                .sort((a, b) => a.shortName.localeCompare(b.shortName))
                .map((problem) => {
                  const sc = scoreCaches.find(
                    (scoreCache) =>
                      scoreCache.team.id === team.id &&
                      scoreCache.problem.id === problem.problem.id,
                  );
                  const solveTime =
                    sc &&
                    currentContest &&
                    formatRestTime(
                      (new Date(sc.solveTime).getTime() -
                        new Date(currentContest.startTime).getTime()) /
                        1000,
                    );
                  return (
                    <Table.Cell
                      key={`score-${team.id}-${problem.shortName}`}
                      style={{ backgroundColor: sc && getScoreboardCellColor(sc) }}
                    >
                      {sc?.submissions ? (
                        <b>
                          {sc.correct ? '+' : '-'}
                          {sc.correct ? sc.submissions - 1 || '' : sc.submissions}
                        </b>
                      ) : (
                        ''
                      )}
                      <br />
                      {sc?.correct ? solveTime : ''}
                    </Table.Cell>
                  );
                })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
});

export default Scoreboard;

function getTeamScore(contest: Contest, team: Team, scoreCaches: ScoreCache[]): number {
  return contest.problems
    .map((p) => p.problem)
    .reduce((res, problem) => {
      const scoreCache = scoreCaches.find(
        (sc) => sc.team.id === team.id && sc.problem.id === problem.id,
      );
      return (
        res +
        (!scoreCache || !scoreCache.correct
          ? 0
          : Math.floor(
              (scoreCache.submissions - 1) * 20 +
                (new Date(scoreCache.solveTime).getTime() -
                  new Date(contest.startTime || '').getTime()) /
                  60000,
            ))
      );
    }, 0);
}

function getScoreboardCellColor(scoreCache: ScoreCache): string {
  if (scoreCache.firstToSolve) return '#1daa1d';
  if (scoreCache.correct) return '#60e760';
  if (scoreCache.pending) return '#fff368';
  if (scoreCache.submissions) return '#e87272';
  return 'white';
}
