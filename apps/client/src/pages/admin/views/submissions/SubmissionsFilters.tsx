import DropDownInput from '@shared/form-controls/DropDownInput';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';

import { LanguagesStore, PublicStore, useStore } from '@core/stores';
import { Filters } from '@core/stores/SubmissionsStore';

const SubmissionsFilters: React.FC<{
  filters: Partial<Filters>;
}> = observer(({ filters }) => {
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { fetchAll: fetchAllLanguages, data: languages } =
    useStore<LanguagesStore>('languagesStore');

  useEffect(() => {
    fetchAllLanguages();
  }, [fetchAllLanguages]);

  return (
    <div className="grid gap-4 rounded bg-white p-4 shadow sm:grid-cols-4 dark:bg-gray-800">
      <DropDownInput<Filters>
        entity={filters}
        field="problems"
        label="Filter by problem"
        placeHolder="All Problems"
        multiple
        options={
          currentContest?.problems.map(({ shortName, problem }) => ({
            key: problem.id,
            text: `${shortName} - ${problem.name}`,
          })) ?? []
        }
        optionsIdField="key"
        optionsTextField="text"
        optionsValueField="key"
      />
      <DropDownInput<Filters>
        entity={filters}
        field="teams"
        label="Filter by team"
        placeHolder="All Teams"
        multiple
        options={currentContest?.teams ?? []}
        optionsIdField="id"
        optionsTextField="name"
        optionsValueField="id"
      />
      <DropDownInput<Filters>
        entity={filters}
        field="languages"
        label="Filter by language"
        placeHolder="All Languages"
        multiple
        options={languages}
        optionsIdField="id"
        optionsTextField="name"
        optionsValueField="id"
      />
      <DropDownInput<Filters>
        entity={filters}
        field="status"
        label="Filter by status"
        placeHolder="All"
        options={[
          {
            key: 'all',
            text: 'All',
            value: undefined,
          },
          {
            key: 'notJudged',
            text: 'Not Judged',
            value: 'notJudged',
          },
          {
            key: 'notVerified',
            text: 'Not Verified',
            value: 'notVerified',
          },
        ]}
        optionsIdField="key"
        optionsTextField="text"
        optionsValueField="value"
      />
    </div>
  );
});

export default SubmissionsFilters;
