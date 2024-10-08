import { EyeIcon } from '@heroicons/react/outline';
import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';
import { ChatBoxDialog } from '@shared/dialogs';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { countUnseenMessages, generalComparator } from '@core/helpers';
import { Clarification } from '@core/models';
import { ClarificationsStore, PublicStore, RootStore, useStore } from '@core/stores';

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
          <div className="flex w-full justify-between">
            {clarification.general || !clarification.problem
              ? 'General'
              : `Problem ${
                  currentContest?.problems?.find(
                    (problem) => problem.problem.id === clarification.problem?.id,
                  )?.shortName ?? '-'
                }`}
            {unseenMessagesCount > 0 && (
              <div className="float-right rounded-md bg-green-500 px-2 py-0.5 text-sm text-white">
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
          result.sort(generalComparator(true)),
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
