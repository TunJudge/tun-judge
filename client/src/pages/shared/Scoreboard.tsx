import React, { useEffect, useState } from 'react';
import { Container, Header, Table } from 'semantic-ui-react';
import { rootStore } from '../../core/stores/RootStore';
import { observer } from 'mobx-react';
import { formatRestTime } from '../../core/helpers';

let interval: NodeJS.Timeout | undefined = undefined;

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

const Scoreboard: React.FC = observer(() => {
  const [standing, setStanding] = useState<TeamStandingRow[]>([]);
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
          firstToSolve,
          submissions,
          solveTime,
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
          pending: !!pending,
          correct: correct,
          firstToSolve: firstToSolve,
          solvedTime: formatRestTime(
            (new Date(solveTime).getTime() - new Date(contest.startTime).getTime()) / 1000,
          ),
          numberOfAttempts: submissions,
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
  }, [scoreCaches]);

  return !currentContest ? (
    <>No Active Contest</>
  ) : (
    <Container textAlign="center">
      <Header>Scoreboard of {currentContest?.name}</Header>
      <Table textAlign="center" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="1">Rank</Table.HeaderCell>
            <Table.HeaderCell width="4">Team</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '3%' }}>=</Table.HeaderCell>
            <Table.HeaderCell width="1">Score</Table.HeaderCell>
            {currentContest.problems
              .slice()
              .sort((a, b) => a.shortName.localeCompare(b.shortName))
              .map((problem) => (
                <Table.HeaderCell key={problem.shortName} width="1">
                  {problem.shortName}
                </Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {standing.map(
            ({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => (
              <Table.Row key={`team-${teamId}`}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell textAlign="left">{teamName}</Table.Cell>
                <Table.Cell>{solvedProblems}</Table.Cell>
                <Table.Cell>{totalScore}</Table.Cell>
                {problemsScores.map((problemScore) => (
                  <Table.Cell
                    key={`score-${teamId}-${problemScore.problemName}`}
                    style={{
                      backgroundColor: getScoreboardCellColor(problemScore),
                    }}
                  >
                    {problemScore.numberOfAttempts ? (
                      <b>
                        {problemScore.correct ? '+' : '-'}
                        {problemScore.correct
                          ? problemScore.numberOfAttempts - 1 || ''
                          : problemScore.numberOfAttempts}
                      </b>
                    ) : (
                      ''
                    )}
                    <br />
                    {problemScore.correct ? problemScore.solvedTime : ''}
                  </Table.Cell>
                ))}
              </Table.Row>
            ),
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
