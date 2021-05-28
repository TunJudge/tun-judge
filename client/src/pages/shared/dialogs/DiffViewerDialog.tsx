import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import DiffViewer from '../DiffViewer';

export type DiffValues = {
  left: {
    value: string;
    title: string;
  };
  right: {
    value: string;
    title: string;
  };
};

export const DiffViewerDialog: React.FC<{
  values?: DiffValues;
  onClose: () => void;
}> = ({ values, onClose }) => {
  return (
    <Modal open={!!values} onClose={onClose}>
      <Modal.Header>Difference</Modal.Header>
      <Modal.Content>
        {values && (
          <DiffViewer
            leftValue={values.left.value}
            leftTitle={values.left.title}
            rightValue={values.right.value}
            rightTitle={values.right.title}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose} size="mini">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
