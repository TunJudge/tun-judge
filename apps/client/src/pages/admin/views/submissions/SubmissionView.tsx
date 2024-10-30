import { CodeIcon, RefreshCwIcon, SendIcon } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spinner, Tooltip } from 'tw-react-components';

import { Prisma, User } from '@prisma/client';

import { CodeEditor, PageTemplate } from '@core/components';
import { LANGUAGES_MAP } from '@core/constants';
import { useAuthContext } from '@core/contexts';
import { useDownloadedFile } from '@core/hooks';
import { useFindFirstSubmission, useUpdateJudging, useUpdateSubmission } from '@core/queries';

import { SubmissionViewDetails } from './SubmissionViewDetails';
import { SubmissionsViewJudgingRuns } from './SubmissionViewJudgingRuns';

export type Submission = Prisma.SubmissionGetPayload<{
  include: {
    team: true;
    contest: true;
    language: true;
    problem: { include: { problem: { include: { testcases: true } } } };
    judgings: {
      include: {
        juryMember: true;
        runs: {
          include: {
            testcase: true;
          };
        };
      };
    };
  };
}>;
export type Judging = Submission['judgings'][number];
export type JudgingRun = Judging['runs'][number];
export type Testcase = JudgingRun['testcase'];

export const SubmissionsView: FC = () => {
  const { profile } = useAuthContext();
  const { submissionId } = useParams();

  const [highlightedJudging, setHighlightedJudging] = useState<Judging>();

  const {
    data: submission,
    isLoading,
    refetch,
  } = useFindFirstSubmission({
    where: { id: parseInt(submissionId ?? '-1') },
    include: {
      team: true,
      contest: true,
      language: true,
      problem: { include: { problem: { include: { testcases: true } } } },
      judgings: {
        orderBy: { startTime: 'desc' },
        include: {
          juryMember: true,
          runs: { include: { testcase: true } },
        },
      },
    },
  });
  const { mutateAsync: updateJudging } = useUpdateJudging();
  const { mutateAsync: updateSubmission } = useUpdateSubmission();

  const content = useDownloadedFile(submission?.sourceFileName);
  const latestJudging = useMemo(
    () => submission?.judgings.filter((j) => j.valid)[0],
    [submission?.judgings],
  );

  const setJudgingValid = (judgingId: number, ignore: boolean) =>
    updateJudging({ where: { id: judgingId }, data: { valid: ignore } });

  const rejudge = async () => {
    if (!submission) return;

    await updateSubmission({ where: { id: submission.id }, data: { judgeHostId: null } });
  };

  const markVerified = (judgingId: number) =>
    updateJudging({ where: { id: judgingId }, data: { verified: true } });

  const claimSubmission = async (judgingId: number) => {
    if (!profile) return;

    await updateJudging({
      where: { id: judgingId },
      data: { juryMemberId: profile.id },
    });
  };

  const unClaimSubmission = async (judgingId: number) => {
    if (!profile) return;

    await updateJudging({
      where: { id: judgingId },
      data: { juryMemberId: null },
    });
  };

  useEffect(() => {
    setHighlightedJudging(latestJudging);
  }, [latestJudging]);

  return !submission || isLoading ? (
    <Spinner fullScreen />
  ) : (
    <PageTemplate
      className="overflow-hidden p-0"
      bodyClassName="overflow-auto"
      icon={SendIcon}
      title={`Submission ${submission.id}`}
      actions={
        <>
          {latestJudging?.result && (
            <Button
              color="blue"
              onClick={() => setJudgingValid(latestJudging.id, !latestJudging.valid)}
            >
              {submission.valid ? 'Ignore' : 'UnIgnore'}
            </Button>
          )}
          {latestJudging?.result && latestJudging.verified && (
            <Button color="red" onClick={rejudge}>
              Rejudge
            </Button>
          )}
          {latestJudging?.result && !latestJudging.verified && (
            <>
              <Button
                color="blue"
                onClick={async () =>
                  isSubmissionClaimedByMe(latestJudging, profile)
                    ? unClaimSubmission(latestJudging.id)
                    : claimSubmission(latestJudging.id)
                }
              >
                {isSubmissionClaimedByMe(latestJudging, profile) ? 'UnClaim' : 'Claim'}
              </Button>
              <Button
                className="whitespace-nowrap"
                color="green"
                onClick={async () => markVerified(latestJudging.id)}
              >
                Mark Verified
              </Button>
            </>
          )}
          <Tooltip content="Refresh" asChild>
            <Button prefixIcon={RefreshCwIcon} onClick={() => refetch()} />
          </Tooltip>
        </>
      }
      isSubSection
      fullHeight
    >
      <SubmissionViewDetails
        submission={submission}
        highlightedJudging={highlightedJudging}
        setHighlightedJudging={setHighlightedJudging}
      />
      <PageTemplate
        className="h-[300px] flex-shrink-0 overflow-visible p-0"
        icon={CodeIcon}
        title="Code Source"
        isSubSection
      >
        <CodeEditor value={content ?? ''} lang={LANGUAGES_MAP[submission.language.name]} readOnly />
      </PageTemplate>
      <SubmissionsViewJudgingRuns judging={highlightedJudging} />
    </PageTemplate>
  );
};

export function isSubmissionClaimedByMe(judging?: Judging, user?: User): boolean {
  return (
    !!judging?.juryMember?.username &&
    !!user?.username &&
    judging?.juryMember?.username === user?.username
  );
}
