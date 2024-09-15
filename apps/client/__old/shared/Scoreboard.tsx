import { RefreshIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { formatRestTime, getRGBColorContrast } from '@core/helpers';
import { ContestsStore, PublicStore, RootStore, useStore } from '@core/stores';

import { NoActiveContest } from './NoActiveContest';
import Tooltip from './tooltip/Tooltip';

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
  const { profile, isUserJury } = useStore<RootStore>('rootStore');
  const { scoreCaches, currentContest: contest } = useStore<PublicStore>('publicStore');
  const { refreshScoreboardCache } = useStore<ContestsStore>('contestsStore');

  const [standing, setStanding] = useState<TeamStandingRow[]>([]);

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

  return !contest ? (
    <NoActiveContest />
  ) : (
    <div className={classNames(className, 'flex max-w-full justify-center p-8 dark:text-white')}>
      <div className="max-w-full select-none rounded-xl border bg-white p-8 shadow dark:border-gray-700 dark:bg-gray-800">
        {!compact && (
          <div className="mb-8 flex items-center justify-center gap-x-1 text-3xl font-medium">
            Scoreboard of {contest.name}
            {isUserJury && (
              <Tooltip content="Refresh" position="right">
                <div
                  className="cursor-pointer rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => refreshScoreboardCache(contest.id)}
                >
                  <RefreshIcon className="h-8 w-8" />
                </div>
              </Tooltip>
            )}
          </div>
        )}
        <div className="overflow-auto">
          <table>
            <thead>
              <tr>
                <th className="p-1">
                  <div className="rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">#</div>
                </th>
                <th className="p-1">
                  <div className="w-52 rounded-xl bg-gray-100 p-3 text-left shadow dark:bg-gray-700">
                    Team
                  </div>
                </th>
                <th className="p-1">
                  <div className="rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">=</div>
                </th>
                <th className="p-1">
                  <div className="rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">Score</div>
                </th>
                {contest.problems
                  .slice()
                  .sort((a, b) => a.shortName.localeCompare(b.shortName))
                  .map((problem) => (
                    <th key={problem.shortName} className="p-1">
                      <Tooltip
                        content={`${problem.shortName} - ${problem.problem.name}`}
                        position="top"
                      >
                        <div
                          className={classNames('w-20 truncate rounded-xl p-3 shadow', {
                            'text-white': getRGBColorContrast(problem.color) < 0.5,
                            'text-black': getRGBColorContrast(problem.color) > 0.5,
                          })}
                          style={{ backgroundColor: problem.color }}
                        >
                          {problem.shortName}
                        </div>
                      </Tooltip>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {!standing.length ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={100}>
                    No teams
                  </td>
                </tr>
              ) : (
                standing.map(
                  ({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => {
                    return (
                      (!compact || teamId === profile?.team?.id) && (
                        <tr key={`team-${teamId}`}>
                          <td className="p-1">
                            <div className="flex h-14 items-center justify-center rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">
                              {index > 0 &&
                              standing[index - 1].totalScore === totalScore &&
                              standing[index - 1].solvedProblems === solvedProblems
                                ? '-'
                                : index + 1}
                            </div>
                          </td>
                          <td className="p-1">
                            <div
                              className="flex h-14 w-52 items-center truncate rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700"
                              title={teamName}
                            >
                              {teamName}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex h-14 items-center justify-center rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">
                              {solvedProblems}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex h-14 items-center justify-center rounded-xl bg-gray-100 p-3 shadow dark:bg-gray-700">
                              {totalScore}
                            </div>
                          </td>
                          {problemsScores.map((problemScore) => (
                            <td key={`score-${teamId}-${problemScore.problemName}`} className="p-1">
                              <div
                                className={classNames(
                                  'flex h-14 flex-col items-center justify-center rounded-xl p-1 text-gray-100 shadow',
                                  {
                                    'bg-green-800':
                                      getScoreboardCellColor(problemScore) === 'green-dark',
                                    'bg-green-600':
                                      getScoreboardCellColor(problemScore) === 'green',
                                    'bg-yellow-600':
                                      getScoreboardCellColor(problemScore) === 'yellow',
                                    'bg-red-600': getScoreboardCellColor(problemScore) === 'red',
                                    'bg-gray-100 dark:bg-gray-700':
                                      getScoreboardCellColor(problemScore) === 'white',
                                  },
                                )}
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
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default Scoreboard;

function getScoreboardCellColor(
  problemScore: TeamProblemScore,
): 'white' | 'green-dark' | 'green' | 'yellow' | 'red' {
  if (problemScore.firstToSolve) return 'green-dark';
  if (problemScore.correct) return 'green';
  if (problemScore.pending) return 'yellow';
  if (problemScore.numberOfAttempts) return 'red';
  return 'white';
}
