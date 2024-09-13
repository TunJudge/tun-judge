import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilAltIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { formatBytes } from '@core/helpers';
import { Problem, Testcase } from '@core/models';
import { RootStore, TestcasesStore, useStore } from '@core/stores';
import { TestcaseContentDialog } from '@shared/dialogs';
import CheckBoxInput from '@shared/form-controls/CheckBoxInput';
import Tooltip from '@shared/tooltip/Tooltip';

import TestcaseBulkUploader from './TestcaseBulkUploader';
import TestcaseForm from './TestcaseForm';

type TestcasesListProps = {
  problem: Problem;
};

const TestcasesList: React.FC<TestcasesListProps> = observer(({ problem }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formTestcase, setFormTestcase] = useState<Partial<Testcase>>({
    problem: problem,
  });
  const [contentViewData, setContentViewData] = useState<{
    testcase: Testcase | undefined;
    field: 'input' | 'output';
  }>({ testcase: undefined, field: 'input' });
  const { isUserAdmin, toastsStore } = useStore<RootStore>('rootStore');
  const { data, fetchAll, create, update, remove, move } =
    useStore<TestcasesStore>('testcasesStore');

  const dismissForm = async () => {
    setFormTestcase({ problem: problem });
    setFormOpen(false);
    await fetchAll();
  };

  return (
    <div className="flex h-full flex-col divide-y overflow-hidden rounded-md bg-white shadow dark:divide-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between p-3">
        <div className="text-lg font-medium">Testcases</div>
        {isUserAdmin && (
          <div className="flex items-center gap-2 text-white">
            <TestcaseBulkUploader problem={problem} />

            <PlusIcon
              className="h-10 w-10 cursor-pointer rounded-md bg-blue-500 p-1 hover:bg-blue-400"
              onClick={() => setFormOpen(true)}
            />
          </div>
        )}
      </div>
      <div className="flex overflow-hidden p-4">
        <div className="flex w-full overflow-auto rounded-md border dark:border-gray-700">
          <table className="min-w-full divide-y dark:divide-gray-800">
            <thead className="sticky top-0 z-10 bg-gray-50 text-center text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr className="divide-x dark:divide-gray-800">
                <th className="p-2 font-medium">#</th>
                <th className="p-2 font-medium">Content</th>
                <th className="p-2 font-medium">Sample</th>
                <th className={classNames('p-2 font-medium')}>Description</th>
                {isUserAdmin && <th />}
              </tr>
            </thead>
            <tbody className="w-full divide-y dark:divide-gray-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="flex w-full items-center justify-center p-3">No data</div>
                  </td>
                </tr>
              ) : (
                data.map((testcase) => (
                  <tr key={`${testcase.id}-in`} className="divide-x dark:divide-gray-700">
                    <td>
                      <div className="flex flex-col items-center justify-center">
                        {testcase.rank > 0 && (
                          <ChevronUpIcon
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => move(testcase.id, 'up')}
                          />
                        )}
                        {testcase.rank}
                        {testcase.rank < data.length - 1 && (
                          <ChevronDownIcon
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => move(testcase.id, 'down')}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="divide-y dark:divide-gray-700">
                        <div className="flex items-center gap-x-1 p-2">
                          <Tooltip
                            className="ml-1"
                            content={testcase.input.md5Sum}
                            position="right"
                          >
                            <div
                              className="cursor-pointer text-blue-500"
                              onClick={() => setContentViewData({ testcase, field: 'input' })}
                            >
                              {`test.${testcase.rank}.in`}
                            </div>
                          </Tooltip>
                          {formatBytes(testcase.input.size)}
                        </div>
                        <div className="flex items-center gap-x-1 p-2">
                          <Tooltip
                            className="ml-1"
                            content={testcase.output.md5Sum}
                            position="right"
                          >
                            <div
                              className="cursor-pointer text-blue-500"
                              onClick={() => setContentViewData({ testcase, field: 'output' })}
                            >
                              {`test.${testcase.rank}.out`}
                            </div>
                          </Tooltip>
                          {formatBytes(testcase.output.size)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <CheckBoxInput<Testcase>
                          entity={testcase}
                          field="sample"
                          onChange={() => update(testcase)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center p-3">{testcase.description ?? '-'}</div>
                    </td>
                    {isUserAdmin && (
                      <td>
                        <div className="flex h-full select-none flex-col items-center justify-center gap-1">
                          <PencilAltIcon
                            className="h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setFormTestcase(testcase);
                              setFormOpen(true);
                            }}
                          />
                          <TrashIcon
                            className="h-8 w-8 cursor-pointer rounded-full p-1 text-red-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => remove(testcase.id)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <TestcaseForm
        isOpen={formOpen}
        item={formTestcase as Testcase}
        onClose={dismissForm}
        onSubmit={async (testcase) => {
          if (testcase.id) {
            await update(testcase);
            await dismissForm();
          } else if (
            data.some(
              ({ input, output }) =>
                input.md5Sum === testcase.input.md5Sum && output.md5Sum === testcase.output.md5Sum,
            )
          ) {
            toastsStore.error('This is a duplicate testcase, select different files');
          } else {
            await create(testcase);
            await dismissForm();
          }
        }}
      />
      <TestcaseContentDialog
        testcase={contentViewData.testcase}
        field={contentViewData.field}
        onClose={() => setContentViewData({ testcase: undefined, field: 'input' })}
      />
    </div>
  );
});

export default TestcasesList;
