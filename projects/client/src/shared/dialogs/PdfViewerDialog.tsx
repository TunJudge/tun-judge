import React from 'react';

import { SimpleDialog } from './SimpleDialog';

export const PdfViewerDialog: React.FC<{ data?: string; dismiss: () => void }> = ({
  data,
  dismiss,
}) => {
  return (
    <SimpleDialog isOpen={!!data} onClose={dismiss}>
      <div style={{ height: '80vh' }}>
        {data && (
          <embed
            className="rounded-lg"
            src={`data:application/pdf;base64,${data}`}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
      </div>
    </SimpleDialog>
  );
};
