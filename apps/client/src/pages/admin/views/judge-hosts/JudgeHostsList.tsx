import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { getDisplayDate } from '@core/helpers';
import { JudgeHost } from '@core/models';
import { JudgeHostsStore, RootStore, useStore } from '@core/stores';

import JudgeHostLogsViewer from './JudgeHostLogsViewer';

let interval: NodeJS.Timeout | undefined = undefined;

const JudgeHostsList: React.FC = observer(() => {
  const { isUserAdmin } = useStore<RootStore>('rootStore');
  const { updateCount, fetchAll, toggle, remove } = useStore<JudgeHostsStore>('judgeHostsStore');

  const [hostname, setHostname] = useState<string>();

  useEffect(() => {
    interval = setInterval(() => fetchAll(), 5000);
    return () => {
      interval && clearInterval(interval);
    };
  }, [fetchAll]);

  const columns: ListPageTableColumn<JudgeHost>[] = [
    {
      header: 'Hostname',
      field: 'hostname',
      render: (judgeHost) => judgeHost.hostname,
    },
    {
      header: 'User',
      field: 'user',
      render: (judgeHost) => judgeHost.user?.username ?? '-',
    },
    {
      header: 'Poll Time',
      field: 'pollTime',
      render: (judgeHost) => (judgeHost.pollTime ? getDisplayDate(judgeHost.pollTime) : '-'),
    },
    {
      header: 'Active',
      field: 'active',
      textAlign: 'center',
      render: (judgeHost) =>
        isUserAdmin ? (
          <div className="flex select-none justify-center">
            <div
              className={classNames('cursor-pointer rounded px-3 py-2 text-white', {
                'bg-red-600': judgeHost.active,
                'bg-green-600': !judgeHost.active,
              })}
              onClick={() => toggle(judgeHost.id, !judgeHost.active)}
            >
              {judgeHost.active ? 'Deactivate' : 'Activate'}
            </div>
          </div>
        ) : judgeHost.active ? (
          'Yes'
        ) : (
          'No'
        ),
    },
    {
      header: 'Live Logs',
      field: 'id',
      textAlign: 'center',
      render: (judgeHost) => (
        <div className="flex select-none justify-center">
          <div
            className={classNames('w-min cursor-pointer rounded bg-blue-600 px-3 py-2 text-white', {
              disabled: !judgeHost.active,
            })}
            onClick={() => setHostname(judgeHost.hostname)}
          >
            Logs
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataTable<JudgeHost>
        header="Judge Hosts"
        dataFetcher={fetchAll}
        dataDependencies={[updateCount]}
        columns={columns}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        rowBackgroundColor={(judgeHost) => {
          if (!judgeHost.active) return 'white';

          const diff = Date.now() - new Date(judgeHost.pollTime).getTime();
          if (diff < 30000) {
            return 'green';
          }
          if (diff < 60000) {
            return 'yellow';
          }
          return 'red';
        }}
      />
      <JudgeHostLogsViewer hostname={hostname} dismiss={() => setHostname(undefined)} />
    </div>
  );
});

export default JudgeHostsList;
