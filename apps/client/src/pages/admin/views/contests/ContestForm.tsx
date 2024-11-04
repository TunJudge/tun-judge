import { PlusIcon, Trash2Icon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Block, Button, DataTable, Flex, FormInputs, Spinner } from 'tw-react-components';

import { PageTemplate } from '@core/components';
import { useAuthContext, useToastContext } from '@core/contexts';
import { ContestProblem, Prisma } from '@core/prisma';
import { useFindFirstContest, useFindManyProblem, useUpsertContest } from '@core/queries';
import { getRandomHexColor } from '@core/utils';

type Contest = Prisma.ContestGetPayload<{
  include: { problems: true };
}>;

const newContest: Partial<Contest> = {
  enabled: true,
  public: true,
  processBalloons: true,
  problems: [],
};

export const ContestForm: FC = () => {
  const { isUserAdmin } = useAuthContext();
  const { toast } = useToastContext();
  const { contestId } = useParams();
  const navigate = useNavigate();

  const { data: contest, isLoading } = useFindFirstContest(
    {
      where: { id: Number(contestId) },
      include: { problems: true },
    },
    { enabled: contestId !== undefined && contestId !== 'new' },
  );
  const { data: problems = [] } = useFindManyProblem();
  const { mutateAsync } = useUpsertContest();

  const form = useForm<Contest>({
    defaultValues: structuredClone(contestId === 'new' ? newContest : contest),
    disabled: !isUserAdmin,
  });

  useEffect(() => {
    form.reset(structuredClone(contestId === 'new' ? newContest : contest));
  }, [form, contest, contestId]);

  const handleSubmit = async ({ id = -1, problems, ...contest }: Contest) => {
    try {
      const newContest = await mutateAsync({
        where: { id },
        create: {
          ...contest,
          problems: { create: fixPoints(problems) },
        },
        update: {
          ...contest,
          problems: {
            deleteMany: {
              contestId: id,
              problemId: { notIn: problems.map(({ problemId }) => problemId) },
            },
            upsert: fixPoints(problems).map(({ contestId, ...problem }) => ({
              where: { contestId_shortName: { contestId: id, shortName: problem.shortName } },
              create: problem,
              update: problem,
            })),
          },
        },
      });

      if (!newContest) return;

      toast('success', `Contest ${newContest?.id ? 'updated' : 'created'} successfully`);

      navigate(`/contests/${newContest.id}/edit`);
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} contest with error: ${(error as Error).message}`,
      );
    }
  };

  if (contestId !== 'new' && (!contest || isLoading)) return <Spinner fullScreen />;

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full w-full flex-col gap-3 overflow-hidden"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Flex fullWidth>
          <FormInputs.Text
            name="name"
            label="Name"
            placeholder="Name"
            autoComplete="off"
            required
          />
          <FormInputs.Text name="shortName" label="Short Name" placeholder="Short Name" required />
        </Flex>
        <Flex fullWidth>
          <FormInputs.DateTime
            name="activateTime"
            label="Activate Time"
            placeholder="Activate Time"
            maxDate={form.watch('startTime')}
            required
          />
          <FormInputs.DateTime
            name="startTime"
            label="Start Time"
            placeholder="Start Time"
            disabled={!form.watch('activateTime')}
            minDate={form.watch('activateTime')}
            maxDate={form.watch('endTime')}
            required
          />
          <FormInputs.DateTime
            name="endTime"
            label="End Time"
            placeholder="End Time"
            disabled={!form.watch('startTime')}
            minDate={form.watch('startTime')}
            required
          />
        </Flex>
        <Flex fullWidth>
          <FormInputs.DateTime
            name="freezeTime"
            label="Freeze Time"
            placeholder="Freeze Time"
            disabled={!form.watch('startTime')}
            minDate={form.watch('startTime')}
            maxDate={form.watch('endTime')}
            required
          />
          <FormInputs.DateTime
            name="unfreezeTime"
            label="Unfreeze Time"
            placeholder="Unfreeze Time"
            disabled={!form.watch('freezeTime')}
            minDate={form.watch('endTime')}
            required
          />
        </Flex>
        <Block className="grid gap-2 sm:grid-cols-3" fullWidth>
          <FormInputs.Checkbox
            name="enabled"
            label="Enabled"
            description="Whether the contest is ready or not?"
          />
          <FormInputs.Checkbox
            name="public"
            label="Visible on public scoreboard"
            description="Whether the contest is visible for anonymous users?"
          />
          <FormInputs.Checkbox
            name="openToAllTeams"
            label="Open to all teams"
            description="Whether the contest is open for any logged in team or only the registered ones?"
          />
          <FormInputs.Checkbox
            name="verificationRequired"
            label="Verification required"
            description="Whether the Jury have to verify the submission before the team see the result?"
          />
          <FormInputs.Checkbox
            name="processBalloons"
            label="Process balloons"
            description="Whether the balloons should be processed or not?"
          />
        </Block>
        <PageTemplate
          className="p-0"
          title="Problems"
          actions={
            <Button
              size="small"
              prefixIcon={PlusIcon}
              onClick={() =>
                form.setValue('problems', [
                  ...form.getValues('problems'),
                  {
                    allowSubmit: true,
                    allowJudge: true,
                    points: 1,
                    color: getRandomHexColor(),
                  } as ContestProblem,
                ])
              }
            />
          }
          fullHeight={false}
          isSubSection
        >
          <DataTable
            rows={form.watch('problems') ?? []}
            columns={[
              {
                header: 'Problem',
                field: 'problemId',
                render: (_, index) => (
                  <FormInputs.Select
                    name={`problems.${index}.problemId`}
                    placeholder="Select Problem"
                    items={problems.map((problem) => ({
                      id: problem.id,
                      label: problem.name,
                      value: problem.id,
                    }))}
                    required
                    validate={(value) =>
                      form.getValues('problems').filter((p) => p.problemId === value).length > 1
                        ? 'Problem already selected'
                        : undefined
                    }
                  />
                ),
              },
              {
                header: 'Short Name',
                field: 'shortName',
                render: (_, index) => (
                  <FormInputs.Text
                    name={`problems.${index}.shortName`}
                    placeholder="Short Name"
                    required
                    validate={(value) =>
                      form.getValues('problems').filter((p) => p.shortName === value).length > 1
                        ? 'Short Name already selected'
                        : undefined
                    }
                  />
                ),
              },
              {
                header: 'Points',
                field: 'points',
                render: (_, index) => (
                  <FormInputs.Number name={`problems.${index}.points`} min={1} />
                ),
              },
              {
                header: 'Allow Submit',
                field: 'allowSubmit',
                align: 'center',
                render: (_, index) => (
                  <FormInputs.Checkbox name={`problems.${index}.allowSubmit`} />
                ),
              },
              {
                header: 'Allow Judge',
                field: 'allowJudge',
                align: 'center',
                render: (_, index) => <FormInputs.Checkbox name={`problems.${index}.allowJudge`} />,
              },
              {
                header: 'Color',
                field: 'color',
                align: 'center',
                render: (_, index) => (
                  <input
                    className="rounded-lg"
                    type="color"
                    value={form.watch(`problems.${index}.color`) ?? ''}
                    disabled={!isUserAdmin}
                    onChange={({ target: { value } }) =>
                      form.setValue(`problems.${index}.color`, value)
                    }
                  />
                ),
              },
            ]}
            actions={[
              {
                icon: Trash2Icon,
                onClick: (_, index) =>
                  form.setValue(
                    'problems',
                    form.getValues('problems').filter((_, i) => i !== index),
                  ),
              },
            ]}
          />
        </PageTemplate>
        {isUserAdmin && (
          <Flex justify="end">
            <Button
              type="submit"
              color="green"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              {contestId === 'new' ? 'Create' : 'Update'}
            </Button>
          </Flex>
        )}
      </form>
    </FormProvider>
  );
};

function fixPoints(problems: ContestProblem[]): ContestProblem[] {
  return problems.map((problem) => ({ ...problem, points: Number(problem.points) }));
}
