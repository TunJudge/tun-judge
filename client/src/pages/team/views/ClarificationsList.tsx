import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import ChatBox from '../../shared/chat-box/ChatBox';
import DataTable, { ListPageTableColumn } from '../../shared/data-table/DataTable';

const ClarificationsList: React.FC = observer(() => {
  const {
    profile,
    publicStore: { currentContest },
    clarificationsStore: { fetchAllForTeam },
  } = rootStore;

  const columns: ListPageTableColumn<Clarification>[] = [
    {
      header: 'Subject',
      field: 'problem',
      render: (clarification) =>
        clarification.general || !clarification.problem
          ? 'General'
          : `Problem ${
              currentContest?.problems?.find(
                (problem) => problem.problem.id === clarification.problem.id,
              )?.shortName ?? '-'
            }`,
    },
  ];

  const fetchAll = () =>
    currentContest && profile?.team
      ? fetchAllForTeam(currentContest.id, profile.team.id)
      : Promise.resolve([]);

  return (
    <DataTable<Clarification>
      header="Clarifications"
      dataFetcher={fetchAll}
      dataDependencies={[currentContest, profile]}
      columns={columns}
      canDelete={() => false}
      ItemForm={ChatBox}
      formItemInitValue={observable({
        general: true,
        contest: currentContest,
        team: profile?.team,
        messages: [],
      })}
    />
  );
});

export default ClarificationsList;
