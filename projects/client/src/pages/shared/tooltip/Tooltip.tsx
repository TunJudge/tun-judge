import React from 'react';
import { rootStore } from '../../../core/stores/RootStore';
import { TooltipPosition } from '../../../core/stores/TooltipStore';

type Props = {
  className?: string;
  position?: TooltipPosition;
  content: React.ReactNode;
  forceHide?: boolean;
};

const Tooltip: React.FC<Props> = ({
  children,
  className,
  position = 'bottom',
  content,
  forceHide,
}) => {
  const { setTooltip } = rootStore.tooltipStore;

  const onMouseEnter = ({ currentTarget }: React.MouseEvent<HTMLDivElement>) =>
    setTooltip({
      className,
      position,
      content,
      forceHide,
      parent: currentTarget.getBoundingClientRect(),
    });

  const onMouseLeave = () => setTooltip(undefined);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};

export default Tooltip;
