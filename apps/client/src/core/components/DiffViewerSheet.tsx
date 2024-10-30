import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog } from 'tw-react-components';

import { DiffViewer } from './DiffViewer';

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

export const DiffViewerSheet: FC<{
  values?: DiffValues;
  onClose: () => void;
}> = ({ values, onClose }) => {
  return (
    <FormDialog
      className="!max-w-7xl"
      open={!!values}
      title="Difference"
      form={useForm()}
      onSubmit={() => void 0}
      onClose={onClose}
    >
      {values && (
        <DiffViewer
          leftValue={values.left.value}
          leftTitle={values.left.title}
          rightValue={values.right.value}
          rightTitle={values.right.title}
        />
      )}
    </FormDialog>
  );
};
