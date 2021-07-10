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
import { formatBytes } from '../../../../../core/helpers';
import { Problem, Testcase } from '../../../../../core/models';
import { rootStore } from '../../../../../core/stores/RootStore';
import { TestcaseContentDialog } from '../../../../shared/dialogs';
import { CheckBoxField } from '../../../../shared/extended-form';
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
  const {
    isUserAdmin,
    testcasesStore: { data, fetchAll, create, update, remove, move },
    toastsStore,
  } = rootStore;

  const dismissForm = async () => {
    setFormTestcase({ problem: problem });
    setFormOpen(false);
    await fetchAll();
  };

  return (
    <div className="flex flex-col h-full bg-white divide-y border shadow rounded-md overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
      <div className="flex p-3 items-center justify-between">
        <div className="text-lg font-medium">Testcases</div>
        {isUserAdmin && (
          <div className="flex items-center text-white gap-2">
            <TestcaseBulkUploader problem={problem} />

            <PlusIcon
              className="w-10 h-10 p-1 bg-blue-500 hover:bg-blue-400 rounded-md cursor-pointer"
              onClick={() => setFormOpen(true)}
            />
          </div>
        )}
      </div>
      <div className="flex p-4 overflow-hidden">
        <div className="flex w-full border rounded-md overflow-auto dark:border-gray-700">
          <table className="min-w-full divide-y dark:divide-gray-800">
            <thead className="sticky top-0 z-10 text-center bg-gray-50 text-gray-700 dark:text-gray-300 dark:bg-gray-700">
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
                    <div className="w-full p-3 flex items-center justify-center">No data</div>
                  </td>
                </tr>
              ) : (
                data.map((testcase) => (
                  <tr key={`${testcase.id}-in`} className="divide-x dark:divide-gray-700">
                    <td>
                      <div className="flex flex-col items-center justify-center">
                        {testcase.rank > 0 && (
                          <ChevronUpIcon
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => move(testcase.id, 'up')}
                          />
                        )}
                        {testcase.rank}
                        {testcase.rank < data.length - 1 && (
                          <ChevronDownIcon
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => move(testcase.id, 'down')}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="divide-y dark:divide-gray-700">
                        <div className="flex items-center p-2 gap-x-1">
                          <div
                            title={testcase.input.md5Sum}
                            className="text-blue-500 cursor-pointer"
                            onClick={() => setContentViewData({ testcase, field: 'input' })}
                          >
                            {`test.${testcase.rank}.in`}
                          </div>
                          {formatBytes(testcase.input.size)}
                        </div>
                        <div className="flex items-center p-2 gap-x-1">
                          <div
                            title={testcase.output.md5Sum}
                            className="text-blue-500 cursor-pointer"
                            onClick={() => setContentViewData({ testcase, field: 'output' })}
                          >
                            {`test.${testcase.rank}.out`}
                          </div>
                          {formatBytes(testcase.output.size)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <CheckBoxField<Testcase>
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
                        <div className="flex flex-col items-center justify-center gap-1 h-full select-none">
                          <PencilAltIcon
                            className="p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setFormTestcase(testcase);
                              setFormOpen(true);
                            }}
                          />
                          <TrashIcon
                            className="p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 text-red-700 dark:hover:bg-gray-700"
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
