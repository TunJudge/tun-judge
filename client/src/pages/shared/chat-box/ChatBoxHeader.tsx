import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { isEmpty } from '../../../core/helpers';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DropdownField, FormErrors } from '../extended-form';

const ChatBoxHeader: React.FC<{ clarification: Clarification }> = observer(({ clarification }) => {
  const [errors, setErrors] = useState<FormErrors<Clarification>>({
    problem: !clarification.general && isEmpty(clarification.problem),
  });
  const {
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    setErrors((errors) => ({
      ...errors,
      problem: !clarification.general && isEmpty(clarification.problem),
    }));
  }, [clarification.general, clarification.problem]);

  return (
    <Segment>
      {clarification.id ? (
        <Header>
          {clarification.id} - {clarification.general ? 'General' : clarification.problem?.name}
        </Header>
      ) : (
        <Form>
          <Form.Group widths="equal" style={{ marginBottom: 0 }}>
            <Form.Dropdown
              selection
              defaultValue="general"
              options={[
                { key: 'general', text: 'General', value: 'general' },
                { key: 'problem', text: 'Problem related', value: 'problem' },
              ]}
              onChange={(_, { value }) => (clarification.general = value === 'general')}
            />
            {!clarification.general && (
              <DropdownField<Clarification>
                entity={clarification}
                field="problem"
                selection
                defaultValue={clarification.problem}
                options={currentContest?.problems.map((problem) => ({
                  ...problem.problem,
                  name: `${problem.shortName} - ${problem.problem.name}`,
                }))}
                isObject
                optionsTextField="name"
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </Form.Group>
        </Form>
      )}
    </Segment>
  );
});

export default ChatBoxHeader;
