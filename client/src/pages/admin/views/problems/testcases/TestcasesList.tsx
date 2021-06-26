import {
  ChevronDownIcon,
  ChevronUpIcon,
  HashtagIcon,
  PencilAltIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Popup } from 'semantic-ui-react';
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
    <div className="flex flex-col h-full bg-white divide-y border shadow rounded-md overflow-hidden">
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
        <div className="flex w-full border rounded-md overflow-hidden">
          <table className="flex flex-col min-w-full divide-y">
            <thead>
              <tr className="grid grid-cols-12 w-full divide-x">
                <th className="p-2">#</th>
                <th className="p-2 col-span-4">Content</th>
                <th className="p-2 col-span-2">Sample</th>
                <th
                  className={classNames('p-2', {
                    'col-span-4': isUserAdmin,
                    'col-span-5': !isUserAdmin,
                  })}
                >
                  Description
                </th>
                {isUserAdmin && <th />}
              </tr>
            </thead>
            <tbody className="w-full overflow-scroll divide-y">
              {data.length === 0 ? (
                <tr className="flex w-full">
                  <td className="w-full p-3 flex items-center justify-center">No data</td>
                </tr>
              ) : (
                data.map((testcase) => (
                  <tr key={`${testcase.id}-in`} className="grid grid-cols-12 divide-x">
                    <td className="flex flex-col items-center justify-center">
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
                    </td>
                    <td className="col-span-4 divide-y">
                      <div className="flex items-center p-2 gap-x-1">
                        <div
                          className="text-blue-500 cursor-pointer"
                          onClick={() => setContentViewData({ testcase, field: 'input' })}
                        >
                          {`test.${testcase.rank}.in`}
                        </div>{' '}
                        {formatBytes(testcase.input.size)}
                        <Popup
                          content={testcase.input.md5Sum}
                          position="top center"
                          trigger={<HashtagIcon className="h-4 w-4" />}
                        />
                      </div>
                      <div className="flex items-center p-2 gap-x-1">
                        <div
                          className="text-blue-500 cursor-pointer"
                          onClick={() => setContentViewData({ testcase, field: 'output' })}
                        >
                          {`test.${testcase.rank}.out`}
                        </div>
                        {formatBytes(testcase.output.size)}
                        <Popup
                          content={testcase.output.md5Sum}
                          position="top center"
                          trigger={<HashtagIcon className="h-4 w-4" />}
                        />
                      </div>
                    </td>
                    <td className="col-span-2 flex items-center justify-center">
                      <CheckBoxField<Testcase>
                        entity={testcase}
                        field="sample"
                        onChange={() => update(testcase)}
                      />
                    </td>
                    <td
                      className={classNames('flex items-center p-3', {
                        'col-span-4': isUserAdmin,
                        'col-span-5': !isUserAdmin,
                      })}
                    >
                      {testcase.description ?? '-'}
                    </td>
                    {isUserAdmin && (
                      <td>
                        <div className="flex flex-col items-center justify-center gap-1 h-full select-none">
                          <PencilAltIcon
                            className="p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200"
                            onClick={() => {
                              setFormTestcase(testcase);
                              setFormOpen(true);
                            }}
                          />
                          <TrashIcon
                            className="p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 text-red-700"
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
        submit={async (testcase) => {
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
