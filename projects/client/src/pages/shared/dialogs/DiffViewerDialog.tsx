import React from 'react';
import DiffViewer from '../DiffViewer';
import { SimpleDialog } from './SimpleDialog';

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
    <SimpleDialog title="Difference" isOpen={!!values} onClose={onClose}>
      {values && (
        <DiffViewer
          leftValue={values.left.value}
          leftTitle={values.left.title}
          rightValue={values.right.value}
          rightTitle={values.right.title}
        />
      )}
    </SimpleDialog>
  );
};
