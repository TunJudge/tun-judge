import { ChevronRight, ClipboardListIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex, Spinner, Table } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useFindFirstProblem, useUpdateManySubmission } from '@models';

import { TestcasesList } from './testcases/TestcasesList';

export type Problem = Prisma.ProblemGetPayload<{
  include: { testcases: { include: { inputFile: true; outputFile: true } } };
}>;

export const ProblemView: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: problem } = useFindFirstProblem({
    where: { id: parseInt(id ?? '-1') },
    include: { testcases: { include: { inputFile: true, outputFile: true } } },
  });
  const { mutate: updateManySubmission } = useUpdateManySubmission();

  const rejudge = (problemId: number) =>
    updateManySubmission({ where: { problemId }, data: { judgeHostId: undefined } });

  return !problem?.id ? (
    <Spinner className="rounded-md shadow" />
  ) : (
    <Flex className="gap-0 overflow-hidden" fullWidth fullHeight>
      <Flex className="gap-0 overflow-hidden" direction="column" fullWidth fullHeight>
        <PageTemplate
          icon={ClipboardListIcon}
          title={
            <>
              <Link to="/problems">Problems</Link>
              <ChevronRight className="h-5 w-5" />
              {problem.name}
            </>
          }
          actions={<Button onClick={() => rejudge(problem.id)}>Rejudge</Button>}
          fullHeight={false}
        >
          <Table className="overflow-auto border dark:border-slate-700">
            <Table.Head className="sticky top-0">
              <Table.Row>
                <Table.Cell>Field</Table.Cell>
                <Table.Cell>Value</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>ID</Table.Cell>
                <Table.Cell>{problem.id}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Name</Table.Cell>
                <Table.Cell>{problem.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Time limit</Table.Cell>
                <Table.Cell>{problem.timeLimit} s</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Memory limit</Table.Cell>
                <Table.Cell>{problem.memoryLimit} Kb</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Output limit</Table.Cell>
                <Table.Cell>{problem.outputLimit} Kb</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </PageTemplate>
        <TestcasesList problem={problem} />
      </Flex>
      <Flex className="overflow-hidden p-3 pl-0" direction="column" fullHeight fullWidth>
        <embed
          className="rounded-lg"
          src={`/files/${encodeURIComponent(problem.statementFileName)}`}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      </Flex>
    </Flex>
  );
};
