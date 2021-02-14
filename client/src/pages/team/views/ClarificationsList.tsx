import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import ChatBox from '../../shared/chat-box/ChatBox';
import ListPage, { ListPageTableColumn } from '../../shared/ListPage';

const ClarificationsList: React.FC = observer(() => {
  const {
    profile,
    publicStore: { currentContest },
    clarificationsStore: { data, fetchAllForTeam },
  } = rootStore;

  useEffect(() => {
    if (profile?.team && currentContest) {
      fetchAllForTeam(currentContest.id, profile.team.id);
    }
  }, [profile?.team, currentContest, fetchAllForTeam]);

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

  return (
    <ListPage<Clarification>
      header="Clarifications"
      data={data}
      columns={columns}
      canDelete={() => false}
      ItemForm={ChatBox}
      formItemInitValue={observable({
        general: true,
        contest: currentContest,
        team: profile?.team,
        messages: [],
      })}
      onRefresh={() => fetchAllForTeam(currentContest!.id, profile!.team.id)}
    />
  );
});

export default ClarificationsList;
