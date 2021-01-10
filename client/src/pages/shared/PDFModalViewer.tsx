import React from 'react';
import { Modal } from 'semantic-ui-react';

type PDFModalViewerProps = { data: string; dismiss: () => void };

const PDFModalViewer: React.FC<PDFModalViewerProps> = ({ data, dismiss }) => {
  return (
    <Modal open onClose={dismiss} size="large">
      <Modal.Content style={{ height: '94vh' }}>
        <embed
          src={`data:application/pdf;base64,${data}`}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      </Modal.Content>
    </Modal>
  );
};

export default PDFModalViewer;
