import { FC } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

type DiffEditorProps = {
  leftValue: string;
  leftTitle: string;
  rightValue: string;
  rightTitle: string;
};

export const DiffViewer: FC<DiffEditorProps> = ({
  leftValue,
  leftTitle,
  rightValue,
  rightTitle,
}) => (
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
