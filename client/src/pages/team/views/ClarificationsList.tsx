import React from 'react';
import { observer } from 'mobx-react';
import ListPage from '../../shared/ListPage';

const ClarificationsList: React.FC = observer(() => {
  return (
    <>
      <ListPage<any>
        header="Clarifications"
        data={[]}
        columns={[]}
        withoutActions
        onRefresh={() => undefined}
      />
      <ListPage<any>
        header="Clarification Requests"
        data={[]}
        columns={[]}
        withoutActions
        onRefresh={() => undefined}
      />
    </>
  );
});

export default ClarificationsList;
