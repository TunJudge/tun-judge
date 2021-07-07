import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../core/helpers';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DropdownField, FormErrors } from '../extended-form';

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
          ({clarification.id}) {clarification.general ? 'General' : clarification.problem?.name}
        </div>
      ) : (
        <form className={`grid grid-cols-${clarification.general ? '1' : '2'} gap-2`}>
          <DropdownField<{ type: 'general' | 'problem' }>
            entity={clarificationForm}
            field="type"
            options={[
              { key: 'general', text: 'General' },
              { key: 'problem', text: 'Problem related' },
            ]}
            optionsIdField="key"
            optionsTextField="text"
            onChange={(value) => (clarification.general = value.key === 'general')}
          />
          {!clarification.general && (
            <DropdownField<Clarification>
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
