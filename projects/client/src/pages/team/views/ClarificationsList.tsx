import { EyeIcon } from '@heroicons/react/outline';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { countUnseenMessages, generalComparator } from '@core/helpers';
import { Clarification } from '@core/models';
import { ClarificationsStore, PublicStore, RootStore, useStore } from '@core/stores';

import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';
import { ChatBoxDialog } from '@shared/dialogs';

const ClarificationsList: React.FC = observer(() => {
  const { profile, updatesCount } = useStore<RootStore>('rootStore');
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { fetchAllForTeam } = useStore<ClarificationsStore>('clarificationsStore');

  const columns: ListPageTableColumn<Clarification>[] = [
    {
      header: 'Subject',
      field: 'problem',
      render: (clarification) => {
        const unseenMessagesCount = countUnseenMessages(clarification, profile!);
        return (
          <div className="flex justify-between w-full">
            {clarification.general || !clarification.problem
              ? 'General'
              : `Problem ${
                  currentContest?.problems?.find(
                    (problem) => problem.problem.id === clarification.problem?.id
                  )?.shortName ?? '-'
                }`}
            {unseenMessagesCount > 0 && (
              <div className="text-sm text-white px-2 py-0.5 rounded-md bg-green-500 float-right">
                {unseenMessagesCount}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const fetchAll = () =>
    currentContest && profile?.team
      ? fetchAllForTeam(currentContest.id, profile.team.id).then((result) =>
          result.sort(generalComparator(true))
        )
      : Promise.resolve([]);

  return (
    <DataTable<Clarification>
      header="Clarifications"
      dataFetcher={fetchAll}
      dataDependencies={[currentContest, updatesCount.clarifications]}
      fetchOnClose
      columns={columns}
      canDelete={() => false}
      ItemForm={ChatBoxDialog}
      formItemInitValue={observable({
        general: true,
        team: profile?.team,
        messages: [],
      })}
      editIcon={EyeIcon}
    />
  );
});

export default ClarificationsList;
