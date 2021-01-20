import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { JudgeHost } from '../../../../core/models';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import moment from 'moment';
import { MOMENT_DEFAULT_FORMAT } from '../../../shared/extended-form';
import { Button } from 'semantic-ui-react';

let interval: NodeJS.Timeout | undefined = undefined;

const JudgeHostsList: React.FC = observer(() => {
  const {
    isUserAdmin,
    judgeHostsStore: { data, fetchAll, toggle, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
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
      render: (judgeHost) =>
        judgeHost.pollTime ? moment(judgeHost.pollTime).format(MOMENT_DEFAULT_FORMAT) : '-',
    },
    {
      header: 'Active',
      field: 'active',
      render: (judgeHost) =>
        isUserAdmin ? (
          <Button
            color={judgeHost.active ? 'red' : 'green'}
            onClick={() => toggle(judgeHost.id, !judgeHost.active)}
          >
            {judgeHost.active ? 'Deactivate' : 'Activate'}
          </Button>
        ) : judgeHost.active ? (
          'Yes'
        ) : (
          'No'
        ),
    },
  ];

  return (
    <ListPage<JudgeHost>
      header="Judge Hosts"
      data={data}
      columns={columns}
      onDelete={remove}
      onRefresh={fetchAll}
      withoutActions={!isUserAdmin}
      rowBackgroundColor={(judgeHost) => {
        if (!judgeHost.active) return '';
        const diff = Date.now() - new Date(judgeHost.pollTime).getTime();
        if (diff < 30000) {
          return '#B3FFC2';
        }
        if (diff < 60000) {
          return '#FFEAC2';
        }
        return '#FFC2C2';
      }}
    />
  );
});

export default JudgeHostsList;
