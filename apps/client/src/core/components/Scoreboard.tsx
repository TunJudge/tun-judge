import { RefreshCwIcon } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Tooltip, cn } from 'tw-react-components';

import { useActiveContest, useAuthContext } from '@core/contexts';
import { formatRestTime, getRGBColorContrast, request } from '@core/utils';

import { NoActiveContest } from './NoActiveContest';

type TeamProblemScore = {
  problemName: string;
  correct: boolean;
  pending: boolean;
  firstToSolve: boolean;
  solvedTime?: string;
  numberOfAttempts: number;
};

type TeamStandingRow = {
  teamId: number;
  teamName: string;
  solvedProblems: number;
  totalScore: number;
  problemsScores: TeamProblemScore[];
};

type Props = {
  className?: string;
  compact?: boolean;
};

export const Scoreboard: FC<Props> = ({ className, compact }) => {
  const { profile, isUserJury } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  const { currentContest, activeContests } = useActiveContest();

  const contest = useMemo(
    () => (id ? activeContests.find((c) => c.id === +id) : currentContest),
    [activeContests, currentContest, id],
  );

  // const { refreshScoreboardCache } = useStore<ContestsStore>('contestsStore');

  const [standing, setStanding] = useState<TeamStandingRow[]>([]);

  useEffect(() => {
    if (contest?.scoreCaches) {
      const cache: { [teamId: string]: TeamStandingRow } = {};
      for (const scoreCache of contest.scoreCaches) {
        const {
          team,
          problemId,
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

        const finalSolveTime = isUserJury ? restrictedSolveTime : solveTime;

        const problemScore =
          !correct || !finalSolveTime
            ? 0
            : Math.floor(
                (submissions - 1) * 20 +
                  (new Date(finalSolveTime).getTime() -
                    new Date(contest.startTime || '').getTime()) /
                    60000,
              );

        if (correct) {
          cache[team.id].solvedProblems++;
          cache[team.id].totalScore += problemScore;
        }

        cache[team.id].problemsScores.push({
          problemName: contest.problems.find((p) => p.id === problemId)?.shortName ?? '',
          pending: !!(isUserJury ? restrictedPending : pending),
          correct: isUserJury ? restrictedCorrect : correct,
          firstToSolve: isUserJury ? restrictedFirstToSolve : firstToSolve,
          solvedTime: finalSolveTime
            ? formatRestTime(
                (new Date(finalSolveTime).getTime() - new Date(contest.startTime).getTime()) / 1000,
                false,
              )
            : undefined,
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
  }, [contest, isUserJury]);

  return !contest ? (
    <NoActiveContest />
  ) : (
    <Flex
      className={cn('select-none', className)}
      direction="column"
      align="center"
      fullWidth
      fullHeight
    >
      {!compact && (
        <Flex className="my-8 gap-1 text-3xl font-medium" align="center" justify="center">
          Scoreboard of {contest.name}
          {isUserJury && (
            <Tooltip content="Refresh" placement="right">
              <div
                className="cursor-pointer rounded-full p-2 hover:bg-slate-300 dark:hover:bg-slate-700"
                onClick={() => request('api/scoreboard/refresh-score-cache', 'PATCH')}
              >
                <RefreshCwIcon className="h-6 w-6" />
              </div>
            </Tooltip>
          )}
        </Flex>
      )}
      <div className="overflow-auto">
        <table className="flex flex-col gap-2">
          <thead>
            <tr className="inline-flex items-center gap-2 [&>th]:rounded-lg [&>th]:bg-slate-300 [&>th]:px-3 [&>th]:py-1.5 dark:[&>th]:bg-slate-800">
              <th className="w-10">#</th>
              <th className="w-52 justify-start">Team</th>
              <th className="w-10">=</th>
              <th className="w-20">Score</th>
              {contest.problems
                .slice()
                .sort((a, b) => a.shortName.localeCompare(b.shortName))
                .map((problem) => (
                  <Tooltip
                    key={problem.shortName}
                    content={`${problem.shortName} - ${problem.problem.name}`}
                    placement="top"
                    asChild
                  >
                    <th
                      className={cn('w-24 truncate', {
                        'text-white': getRGBColorContrast(problem.color) < 0.5,
                        'text-black': getRGBColorContrast(problem.color) > 0.5,
                      })}
                      style={{ backgroundColor: problem.color }}
                    >
                      {problem.shortName}
                    </th>
                  </Tooltip>
                ))}
            </tr>
          </thead>
          <tbody className="flex flex-col gap-2">
            {!standing.length ? (
              <tr className="inline-flex justify-center">
                <td className="p-4 text-slate-500" colSpan={100}>
                  No teams
                </td>
              </tr>
            ) : (
              standing.map(
                ({ teamId, teamName, solvedProblems, totalScore, problemsScores }, index) => {
                  return (
                    (!compact || teamId === profile?.teamId) && (
                      <tr
                        key={`team-${teamId}`}
                        className="inline-flex items-center gap-2 [&>td]:flex [&>td]:h-12 [&>td]:items-center [&>td]:justify-center [&>td]:rounded-lg [&>td]:bg-slate-200 [&>td]:px-3 [&>td]:py-1.5 dark:[&>td]:bg-slate-700"
                      >
                        <td className="w-10">
                          {index > 0 &&
                          standing[index - 1].totalScore === totalScore &&
                          standing[index - 1].solvedProblems === solvedProblems
                            ? '-'
                            : index + 1}
                        </td>
                        <td className="w-52 !justify-start truncate" title={teamName}>
                          {teamName}
                        </td>
                        <td className="w-10">{solvedProblems}</td>
                        <td className="w-20 truncate">{totalScore}</td>
                        {problemsScores.map((problemScore) => (
                          <td
                            key={`score-${teamId}-${problemScore.problemName}`}
                            className={cn('w-24 flex-col', {
                              '!bg-green-500 dark:!bg-green-900':
                                getScoreboardCellColor(problemScore) === 'green-dark',
                              '!bg-green-300 dark:!bg-green-600':
                                getScoreboardCellColor(problemScore) === 'green',
                              '!bg-yellow-400 dark:!bg-yellow-700':
                                getScoreboardCellColor(problemScore) === 'yellow',
                              '!bg-red-300 dark:!bg-red-900':
                                getScoreboardCellColor(problemScore) === 'red',
                            })}
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
    </Flex>
  );
};

function getScoreboardCellColor(
  problemScore: TeamProblemScore,
): 'white' | 'green-dark' | 'green' | 'yellow' | 'red' {
  if (problemScore.firstToSolve) return 'green-dark';
  if (problemScore.correct) return 'green';
  if (problemScore.pending) return 'yellow';
  if (problemScore.numberOfAttempts) return 'red';
  return 'white';
}
