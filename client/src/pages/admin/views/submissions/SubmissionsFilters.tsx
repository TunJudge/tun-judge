import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Form, Segment } from 'semantic-ui-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { Filters } from '../../../../core/stores/SubmissionsStore';

const SubmissionsFilters: React.FC<{
  filters: Partial<Filters>;
  onChange?: (filters: Partial<Filters>) => void;
}> = observer(({ filters, onChange }) => {
  const {
    languagesStore: { fetchAll: fetchAllLanguages, data: languages },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAllLanguages();
  }, [fetchAllLanguages]);

  return (
    <Segment>
      <Form>
        <Form.Group widths="equal">
          <Form.Dropdown
            label="Filter by problem"
            fluid
            multiple
            selection
            clearable
            value={filters.problems ?? []}
            placeholder="All Problems"
            options={
              currentContest?.problems.map(({ shortName, problem }) => ({
                key: problem.id,
                text: `${shortName} - ${problem.name}`,
                value: problem.id,
              })) ?? []
            }
            onChange={(_, { value }) => {
              const problems = value as number[];
              if (problems.length) {
                onChange?.({ ...filters, problems });
              } else {
                delete filters.problems;
                onChange?.({ ...filters });
              }
            }}
          />
          <Form.Dropdown
            label="Filter by team"
            fluid
            multiple
            selection
            clearable
            value={filters.teams ?? []}
            placeholder="All Teams"
            options={
              currentContest?.teams.map((team) => ({
                key: team.id,
                text: team.name,
                value: team.id,
              })) ?? []
            }
            onChange={(_, { value }) => {
              const teams = value as number[];
              if (teams.length) {
                onChange?.({ ...filters, teams });
              } else {
                delete filters.teams;
                onChange?.({ ...filters });
              }
            }}
          />
          <Form.Dropdown
            label="Filter by language"
            fluid
            multiple
            selection
            clearable
            value={filters.languages ?? []}
            placeholder="All Languages"
            options={languages.map((language) => ({
              key: language.id,
              text: language.name,
              value: language.id,
            }))}
            onChange={(_, { value }) => {
              const languages = value as number[];
              if (languages.length) {
                onChange?.({ ...filters, languages });
              } else {
                delete filters.languages;
                onChange?.({ ...filters });
              }
            }}
          />
          <Form.Dropdown
            label="Filter by status"
            fluid
            selection
            clearable
            value={filters.notJudged ? 'notJudged' : filters.notVerified ? 'notVerified' : ''}
            placeholder="All"
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
            onChange={(_, { value }) => {
              if (value === 'notJudged') {
                filters.notJudged = true;
                delete filters.notVerified;
              } else if (value === 'notVerified') {
                filters.notVerified = true;
                delete filters.notJudged;
              } else {
                delete filters.notJudged;
                delete filters.notVerified;
              }
              onChange?.({ ...filters });
            }}
          />
        </Form.Group>
      </Form>
    </Segment>
  );
});

export default SubmissionsFilters;
