import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Button, Container, Header, Icon, Segment, Table } from 'semantic-ui-react';
import { formatRestTime } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import './Scoreboard.scss';

type TeamProblemScore = {
  problemName: string;
  correct: boolean;
  pending: boolean;
  firstToSolve: boolean;
  solvedTime: string;
  numberOfAttempts: number;
};

type TeamStandingRow = {
  teamId: number;
  teamName: string;
  solvedProblems: number;
  totalScore: number;
  problemsScores: TeamProblemScore[];
};

const Scoreboard: React.FC<{ compact?: boolean }> = observer(({ compact }) => {
  const [standing, setStanding] = useState<TeamStandingRow[]>([]);
  const {
    profile,
    isUserJury,
    publicStore: { currentContest, scoreCaches },
    contestsStore: { refreshScoreboardCache },
  } = rootStore;

  useEffect(() => {
    if (scoreCaches) {
      const cache: { [teamId: string]: TeamStandingRow } = {};
      for (const scoreCache of scoreCaches) {
        const {
          contest,
          team,
          problem,
          correct,
          pending,
          solveTime,
          submissions,
          firstToSolve,
          restrictedCorrect,
          restrictedPending,
          restrictedSolveTime,
          restrictedSubmissions,
          restrictedFirstToSolve,
        } = scoreCache;
        if (!cache[team.id]) {
          cache[team.id] = {
            teamId: team.id,
            teamName: team.name,
            solvedProblems: 0,
            totalScore: 0,
            problemsScores: [],
          };
        }
        const problemScore = !correct
          ? 0
          : Math.floor(
              (submissions - 1) * 20 +
                (new Date(solveTime).getTime() - new Date(contest.startTime || '').getTime()) /
                  60000,
            );
        if (correct) {
          cache[team.id].solvedProblems++;
          cache[team.id].totalScore += problemScore;
        }
        cache[team.id].problemsScores.push({
          problemName: contest.problems.find((p) => p.problem.id === problem.id)!.shortName,
          pending: !!(isUserJury ? restrictedPending : pending),
          correct: isUserJury ? restrictedCorrect : correct,
          firstToSolve: isUserJury ? restrictedFirstToSolve : firstToSolve,
          solvedTime: formatRestTime(
            (new Date(isUserJury ? restrictedSolveTime : solveTime).getTime() -
              new Date(contest.startTime).getTime()) /
              1000,
            false,
          ),
          numberOfAttempts: isUserJury ? restrictedSubmissions : submissions,
        });
      }
      setStanding(
        Object.values(cache)
          .sort((a, b) =>
            a.solvedProblems === b.solvedProblems
              ? a.totalScore === b.totalScore
                ? a.teamName.localeCompare(b.teamName)
                : a.totalScore - b.totalScore
              : b.solvedProblems - a.solvedProblems,
          )
          .map((row) => {
            row.problemsScores.sort((a, b) => a.problemName.localeCompare(b.problemName));
            return row;
          }),
      );
    }
  }, [scoreCaches, isUserJury]);

  return !currentContest ? (
    <Container textAlign="center" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Segment>
        <Header size="huge">{'No Active Contest'}</Header>
      </Segment>
    </Container>
  ) : (
    <Container className="scoreboard" textAlign="center" fluid>
      {!compact && (
        <Header className="scoreboard-header">
          Scoreboard of {currentContest?.name}
          {isUserJury && (
            <Button
              floated="right"
              style={{ position: 'absolute', right: '2.5rem' }}
              color="blue"
              onClick={() => refreshScoreboardCache(currentContest?.id)}
            >
              <Icon name="refresh" />
              Refresh
            </Button>
          )}
        </Header>
      )}
      <Table className="scoreboard-body" textAlign="center" striped collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>=</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
            {currentContest.problems
              .slice()
              .sort((a, b) => a.shortName.localeCompare(b.shortName))
              .map((problem) => (
                <Table.HeaderCell key={problem.shortName}>{problem.shortName}</Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {standing.map(
            ({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => {
              return (
                (!compact || teamId === profile?.team.id) && (
                  <Table.Row key={`team-${teamId}`}>
                    <Table.Cell>
                      {index > 0 &&
                      standing[index - 1].totalScore === totalScore &&
                      standing[index - 1].solvedProblems === solvedProblems
                        ? '-'
                        : index + 1}
                    </Table.Cell>
                    <Table.Cell className="scoreboard-team-name" textAlign="left">
                      {teamName}
                    </Table.Cell>
                    <Table.Cell>{solvedProblems}</Table.Cell>
                    <Table.Cell>{totalScore}</Table.Cell>
                    {problemsScores.map((problemScore) => (
                      <Table.Cell
                        className="scoreboard-score-column"
                        key={`score-${teamId}-${problemScore.problemName}`}
                        style={{ backgroundColor: getScoreboardCellColor(problemScore) }}
                      >
                        {problemScore.numberOfAttempts ? (
                          <b>
                            {problemScore.correct ? '+' : !problemScore.pending ? '-' : ''}
                            {problemScore.correct
                              ? problemScore.numberOfAttempts - 1 || ''
                              : problemScore.numberOfAttempts}
                          </b>
                        ) : (
                          <br />
                        )}
                        <br />
                        <small>{problemScore.correct ? problemScore.solvedTime : ''}</small>
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )
              );
            },
          )}
        </Table.Body>
      </Table>
    </Container>
  );
});

export default Scoreboard;

function getScoreboardCellColor(problemScore: TeamProblemScore): string {
  if (problemScore.firstToSolve) return '#1daa1d';
  if (problemScore.correct) return '#60e760';
  if (problemScore.pending) return '#fff368';
  if (problemScore.numberOfAttempts) return '#e87272';
  return 'white';
}
