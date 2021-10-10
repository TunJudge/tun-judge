import { action, observable } from 'mobx';
import React from 'react';

export type TooltipPosition = 'top' | 'left' | 'right' | 'bottom';

export type Tooltip = {
  className?: string;
  position?: TooltipPosition;
  content: React.ReactNode;
  forceHide?: boolean;
  parent: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
};

export class TooltipStore {
  @observable tooltip: Tooltip | undefined;

  @action
  setTooltip = (tooltip?: Tooltip): void => {
    this.tooltip = tooltip;
  };
}
