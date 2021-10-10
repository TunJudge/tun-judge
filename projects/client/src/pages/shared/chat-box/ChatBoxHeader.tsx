import classNames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../core/helpers';
import { Clarification, Problem } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import DropDownInput from '../form-controls/DropDownInput';
import { FormErrors } from '../form-controls/types';

const ChatBoxHeader: React.FC<{ clarification: Clarification }> = observer(({ clarification }) => {
  const clarificationForm = useLocalStore<{ type: 'general' | 'problem' }>(() => ({
    type: 'general',
  }));
  const [errors, setErrors] = useState<FormErrors<Clarification>>({});
  const {
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    setErrors({
      problem: !clarification.general && isEmpty(clarification.problem),
    });
  }, [clarification.general, clarification.problem]);

  return (
    <div>
      {clarification.id ? (
        <div className="text-2xl font-medium mb-2">
          {clarification.general
            ? 'General'
            : `${
                currentContest?.problems.find((p) => p.problem.id === clarification.problem?.id)
                  ?.shortName
              } - ${clarification.problem?.name}`}
        </div>
      ) : (
        <form
          className={classNames('grid gap-2', {
            'grid-cols-1': clarification.general,
            'grid-cols-2': !clarification.general,
          })}
        >
          <DropDownInput<{ type: 'general' | 'problem' }>
            entity={clarificationForm}
            field="type"
            options={[
              { key: 'general', text: 'General' },
              { key: 'problem', text: 'Problem related' },
            ]}
            optionsIdField="key"
            optionsTextField="text"
            optionsValueField="key"
            onChange={(value: 'general' | 'problem') => {
              clarification.general = value === 'general';
              clarification.general && (clarification.problem = undefined);
            }}
          />
          {!clarification.general && (
            <DropDownInput<Clarification, Problem>
              entity={clarification}
              field="problem"
              placeHolder="Problem"
              defaultValue={clarification.problem}
              options={currentContest?.problems
                .map((problem) => ({
                  ...problem.problem,
                  name: `${problem.shortName} - ${problem.problem.name}`,
                }))
                .sort((a, b) => a.name.localeCompare(b.name))}
              optionsTextField="name"
              errors={errors}
              setErrors={setErrors}
            />
          )}
        </form>
      )}
    </div>
  );
});

export default ChatBoxHeader;
