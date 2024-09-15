// organize-imports-ignore
import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

type DiffEditorProps = {
  leftValue: string;
  leftTitle: string;
  rightValue: string;
  rightTitle: string;
};

const DiffViewer: React.FC<DiffEditorProps> = ({
  leftValue,
  leftTitle,
  rightValue,
  rightTitle,
}) => {
  return (
    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <ReactDiffViewer
        oldValue={leftValue}
        leftTitle={leftTitle}
        newValue={rightValue}
        rightTitle={rightTitle}
        showDiffOnly
      />
    </div>
  );
};

export default DiffViewer;
