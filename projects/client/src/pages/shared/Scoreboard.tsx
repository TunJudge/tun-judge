import { RefreshIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { formatRestTime, getRGBColorContrast } from '../../core/helpers';
import { Contest } from '../../core/models';
import { rootStore } from '../../core/stores/RootStore';
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

type Props = { contest: Contest; compact?: boolean; className?: string };

const Scoreboard: React.FC<Props> = observer(({ contest, compact, className }) => {
  const [standing, setStanding] = useState<TeamStandingRow[]>([]);
  const {
    profile,
    isUserJury,
    publicStore: { scoreCaches },
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
                  60000
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
            false
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
              : b.solvedProblems - a.solvedProblems
          )
          .map((row) => {
            row.problemsScores.sort((a, b) => a.problemName.localeCompare(b.problemName));
            return row;
          })
      );
    }
  }, [scoreCaches, isUserJury]);

  return (
    <div className={classNames(className, 'flex justify-center dark:text-white p-8 max-w-full')}>
      <div className="max-w-full p-8 bg-white rounded-xl border shadow select-none dark:bg-gray-800 dark:border-gray-700">
        {!compact && (
          <div className="flex items-center justify-center text-3xl mb-8 font-medium gap-x-1">
            Scoreboard of {contest.name}
            {isUserJury && (
              <Tooltip content="Refresh" position="right">
                <div
                  className="p-2 hover:bg-gray-300 rounded-full cursor-pointer dark:hover:bg-gray-700"
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
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">#</div>
                </th>
                <th className="p-1">
                  <div className="w-52 p-3 bg-gray-100 dark:bg-gray-700 shadow rounded-xl text-left">
                    Team
                  </div>
                </th>
                <th className="p-1">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">=</div>
                </th>
                <th className="p-1">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">Score</div>
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
                          className={classNames('p-3 shadow rounded-xl truncate w-20', {
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
                  <td className="text-center p-4 text-gray-500" colSpan={100}>
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
                            <div className="flex items-center justify-center p-3 h-14 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">
                              {index > 0 &&
                              standing[index - 1].totalScore === totalScore &&
                              standing[index - 1].solvedProblems === solvedProblems
                                ? '-'
                                : index + 1}
                            </div>
                          </td>
                          <td className="p-1">
                            <div
                              className="flex items-center p-3 h-14 w-52 bg-gray-100 dark:bg-gray-700 shadow rounded-xl truncate"
                              title={teamName}
                            >
                              {teamName}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex items-center justify-center p-3 h-14 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">
                              {solvedProblems}
                            </div>
                          </td>
                          <td className="p-1">
                            <div className="flex items-center justify-center p-3 h-14 bg-gray-100 dark:bg-gray-700 shadow rounded-xl">
                              {totalScore}
                            </div>
                          </td>
                          {problemsScores.map((problemScore) => (
                            <td key={`score-${teamId}-${problemScore.problemName}`} className="p-1">
                              <div
                                className={classNames(
                                  'flex flex-col items-center justify-center p-1 h-14 text-gray-100 shadow rounded-xl',
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
                                  }
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
                  }
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
  problemScore: TeamProblemScore
): 'white' | 'green-dark' | 'green' | 'yellow' | 'red' {
  if (problemScore.firstToSolve) return 'green-dark';
  if (problemScore.correct) return 'green';
  if (problemScore.pending) return 'yellow';
  if (problemScore.numberOfAttempts) return 'red';
  return 'white';
}
