import { RefreshIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { formatRestTime } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import { NoActiveContest } from './NoActiveContest';

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

type Props = { compact?: boolean; className?: string };

const Scoreboard: React.FC<Props> = observer(({ compact, className }) => {
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

  return (
    <div className={classNames(className, 'flex justify-center h-full')}>
      {!currentContest ? (
        <NoActiveContest />
      ) : (
        <div>
          {!compact && (
            <div className="flex items-center justify-center text-3xl py-12 font-medium gap-x-1">
              Scoreboard of {currentContest.name}
              {isUserJury && (
                <div
                  className="p-2 hover:bg-gray-300 rounded-full cursor-pointer"
                  title="Refresh"
                  onClick={() => refreshScoreboardCache(currentContest.id)}
                >
                  <RefreshIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th className="p-1">
                  <div className="p-3 bg-white shadow rounded-xl">#</div>
                </th>
                <th className="p-1">
                  <div className="p-3 bg-white shadow rounded-xl text-left">Team</div>
                </th>
                <th className="p-1">
                  <div className="p-3 bg-white shadow rounded-xl">=</div>
                </th>
                <th className="p-1">
                  <div className="p-3 bg-white shadow rounded-xl">Score</div>
                </th>
                {currentContest.problems
                  .slice()
                  .sort((a, b) => a.shortName.localeCompare(b.shortName))
                  .map((problem) => (
                    <th key={problem.shortName} className="p-1">
                      <div className="p-3 bg-white shadow rounded-xl">{problem.shortName}</div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {standing.map(
                ({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => {
                  return (
                    (!compact || teamId === profile?.team.id) && (
                      <tr key={`team-${teamId}`}>
                        <td className="p-1">
                          <div className="flex items-center justify-center p-3 h-14 bg-white shadow rounded-xl">
                            {index > 0 &&
                            standing[index - 1].totalScore === totalScore &&
                            standing[index - 1].solvedProblems === solvedProblems
                              ? '-'
                              : index + 1}
                          </div>
                        </td>
                        <td className="p-1">
                          <div className="flex items-center p-3 h-14 w-52 bg-white shadow rounded-xl">
                            {teamName}
                          </div>
                        </td>
                        <td className="p-1">
                          <div className="flex items-center justify-center p-3 h-14 bg-white shadow rounded-xl">
                            {solvedProblems}
                          </div>
                        </td>
                        <td className="p-1">
                          <div className="flex items-center justify-center p-3 h-14 bg-white shadow rounded-xl">
                            {totalScore}
                          </div>
                        </td>
                        {problemsScores.map((problemScore) => (
                          <td className="p-1" key={`score-${teamId}-${problemScore.problemName}`}>
                            <div
                              className={`flex flex-col items-center justify-center p-3 h-14 text-white shadow rounded-xl bg-${getScoreboardCellColor(
                                problemScore,
                              )}`}
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
                              <small>{problemScore.correct ? problemScore.solvedTime : ''}</small>
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default Scoreboard;

function getScoreboardCellColor(problemScore: TeamProblemScore): string {
  if (problemScore.firstToSolve) return 'green-800';
  if (problemScore.correct) return 'green-600';
  if (problemScore.pending) return 'yellow-600';
  if (problemScore.numberOfAttempts) return 'red-600';
  return 'white';
}
