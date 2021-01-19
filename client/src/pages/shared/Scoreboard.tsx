import React, { useEffect, useState } from 'react';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { rootStore } from '../../core/stores/RootStore';
import { observer } from 'mobx-react';
import { formatRestTime } from '../../core/helpers';

import './Scoreboard.scss';

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

const Scoreboard: React.FC<{ compact?: boolean }> = observer(({ compact }) => {
  const [standing, setStanding] = useState<TeamStandingRow[]>([]);
  const {
    profile,
    isUserJury,
    publicStore: { currentContest, scoreCaches, fetchScoreCaches },
    contestsStore: { refreshScoreboardCache },
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
    <>No Active Contest</>
  ) : (
    <div className="scoreboard">
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
      <Grid
        columns="equal"
        className={`scoreboard-grid-${Math.ceil(currentContest.problems.length / 3) * 3}`}
      >
        <Grid.Row className="scoreboard-header-row">
          <Grid.Column
            style={{ maxWidth: currentContest.problems.length > 8 ? '33%' : '40%' }}
            className="scoreboard-sub-column"
          >
            <Grid columns="equal" className="scoreboard-sub-grid">
              <Grid.Row>
                <Grid.Column width="2">
                  <Segment>#</Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>Team</Segment>
                </Grid.Column>
                <Grid.Column width="2">
                  <Segment>=</Segment>
                </Grid.Column>
                <Grid.Column width="3">
                  <Segment>Score</Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column className="scoreboard-sub-column">
            <Grid columns="equal" className="scoreboard-sub-grid">
              <Grid.Row>
                {currentContest.problems
                  .slice()
                  .sort((a, b) => a.shortName.localeCompare(b.shortName))
                  .map((problem) => (
                    <Grid.Column key={problem.shortName}>
                      <Segment style={{ borderBottom: `2px solid ${problem.color}` }}>
                        {problem.shortName}
                      </Segment>
                    </Grid.Column>
                  ))}
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        {standing.map(({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => {
          return (
            (!compact || teamId === profile?.team.id) && (
              <Grid.Row key={`team-${teamId}`}>
                <Grid.Column
                  style={{ maxWidth: currentContest.problems.length > 8 ? '33%' : '40%' }}
                  className="scoreboard-sub-column"
                >
                  <Grid columns="equal" className="scoreboard-sub-grid">
                    <Grid.Row>
                      <Grid.Column width="2">
                        <Segment>
                          <p className="content-center">{index + 1}</p>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column textAlign="left">
                        <Segment>
                          <p className="content-left">
                            <i>{teamName}</i>
                          </p>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column width="2">
                        <Segment>
                          <p className="content-center">{solvedProblems}</p>
                        </Segment>
                      </Grid.Column>
                      <Grid.Column width="3">
                        <Segment>
                          <p className="content-center">{totalScore}</p>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column className="scoreboard-sub-column">
                  <Grid columns="equal" className="scoreboard-sub-grid">
                    <Grid.Row>
                      {problemsScores.map((problemScore) => (
                        <Grid.Column key={`score-${teamId}-${problemScore.problemName}`}>
                          <Segment
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
                          </Segment>
                        </Grid.Column>
                      ))}
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            )
          );
        })}
      </Grid>
    </div>
  );
});

export default Scoreboard;

function getScoreboardCellColor(problemScore: TeamProblemScore): string {
  if (problemScore.pending) return '#fff368';
  if (problemScore.firstToSolve) return '#1daa1d';
  if (problemScore.correct) return '#60e760';
  if (problemScore.numberOfAttempts) return '#e87272';
  return 'white';
}
