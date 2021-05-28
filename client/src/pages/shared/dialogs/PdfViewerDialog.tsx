import React from 'react';
import { Modal } from 'semantic-ui-react';

export const PdfViewerDialog: React.FC<{ data?: string; dismiss: () => void }> = ({
  data,
  dismiss,
}) => {
  return (
    <Modal open={!!data} onClose={dismiss} size="large">
      <Modal.Content style={{ height: '94vh' }}>
        {data && (
          <embed
            src={`data:application/pdf;base64,${data}`}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
      </Modal.Content>
    </Modal>
  );
};
