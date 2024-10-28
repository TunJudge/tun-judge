import { ArrowUpDownIcon, EditIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  CheckboxInput,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  Flex,
  ListSorterDialog,
  Tooltip,
} from 'tw-react-components';

import { CodeEditorSheet, PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useDeleteTestcase, useUpdateTestcase } from '@core/queries';
import { formatBytes } from '@core/utils';

import { Problem } from '../ProblemView';
import { TestcaseBulkUploader } from './TestcaseBulkUploader';
import { TestcaseForm } from './TestcaseForm';

export type Testcase = Problem['testcases'][number];

type Props = {
  problem: Problem;
};

export const TestcasesList: FC<Props> = ({ problem }) => {
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [testcase, setTestcase] = useState<Partial<Testcase>>();
  const [testcaseFileName, setTestcaseFileName] = useState<string>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const [sorterOpen, setSorterOpen] = useState(false);

  const { mutate: updateTestcase } = useUpdateTestcase();
  const { mutate: deleteTestcase } = useDeleteTestcase();

  const columns: DataTableColumn<Testcase>[] = [
    {
      header: '#',
      field: 'rank',
    },
    {
      header: 'Content',
      field: 'inputFile',
      render: (testcase) => (
        <Flex direction="column">
          <Flex className="gap-1" align="center">
            <Tooltip content={testcase.inputFile.md5Sum} placement="top">
              <div
                className="cursor-pointer text-blue-500"
                onClick={() => setTestcaseFileName(testcase.inputFileName)}
              >
                {`test.${testcase.rank}.in`}
              </div>
            </Tooltip>
            {formatBytes(testcase.inputFile.size)}
          </Flex>
          <Flex className="gap-1" align="center">
            <Tooltip content={testcase.outputFile.md5Sum} placement="top">
              <div
                className="cursor-pointer text-blue-500"
                onClick={() => setTestcaseFileName(testcase.outputFileName)}
              >
                {`test.${testcase.rank}.out`}
              </div>
            </Tooltip>
            {formatBytes(testcase.outputFile.size)}
          </Flex>
        </Flex>
      ),
    },
    {
      header: 'Sample',
      field: 'sample',
      align: 'center',
      render: (testcase) => (
        <CheckboxInput
          className="w-fit"
          checked={testcase.sample}
          // onChange={() => update(row)}
        />
      ),
    },
    {
      header: 'Description',
      field: 'description',
    },
  ];

  const toggleSorter = () => setSorterOpen(!sorterOpen);

  const updateOrder = (items: Testcase[]) =>
    Promise.all(
      items.map((testcase, index) =>
        updateTestcase({ where: { id: testcase.id }, data: { rank: index } }),
      ),
    );

  return (
    <PageTemplate
      title="Testcases"
      actions={
        isUserAdmin && (
          <>
            <TestcaseBulkUploader problem={problem} />
            <Button prefixIcon={ArrowUpDownIcon} onClick={toggleSorter} />
            <Button prefixIcon={PlusIcon} onClick={() => setTestcase({ problemId: problem.id })} />
          </>
        )
      }
      fullHeight={false}
      isSubSection
    >
      <DataTable
        rows={problem.testcases}
        columns={columns}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setTestcase,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteTestcase({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Problem"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this test case?
      </ConfirmDialog>
      <ListSorterDialog
        className="!max-w-4xl"
        title="Sort Testcases"
        open={sorterOpen}
        items={problem.testcases}
        idResolver={(testcase) => testcase.id.toString()}
        renderer={(testcase) => `Testcase ${testcase.rank}`}
        onClose={toggleSorter}
        onSubmit={updateOrder}
      />
      <TestcaseForm
        problem={problem}
        testcase={testcase}
        onSubmit={() => setTestcase(undefined)}
        onClose={() => setTestcase(undefined)}
      />
      <CodeEditorSheet
        lang="text"
        fileName={testcaseFileName}
        onClose={() => setTestcaseFileName(undefined)}
        readOnly
      />
    </PageTemplate>
  );
};
