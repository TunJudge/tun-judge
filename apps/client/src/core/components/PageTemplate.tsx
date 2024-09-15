import { LucideIcon } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';
import { Flex, FlexProps, cn } from 'tw-react-components';

import { FiltersContent, FiltersProps, FiltersTrigger } from './filters';

type Props = Omit<FlexProps, 'title'> & {
  icon?: LucideIcon;
  title: ReactNode;
  actions?: ReactNode;
  bodyClassName?: string;
  filtersProps?: FiltersProps;
  headerBottomBorder?: boolean;
};

export const PageTemplate = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      bodyClassName,
      icon: Icon,
      title,
      actions,
      filtersProps,
      headerBottomBorder,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Flex
        className={cn('overflow-hidden', headerBottomBorder ? 'gap-0' : 'p-3', className)}
        direction="column"
        fullHeight
        fullWidth
        {...props}
        ref={ref}
      >
        <Flex
          className={cn(headerBottomBorder && 'border-b p-3 dark:border-slate-700/80')}
          align="center"
          justify="between"
          fullWidth
        >
          <Flex className="gap-2 text-xl" align="center">
            {Icon && <Icon className="mx-1 h-6 w-6" />}
            {title}
            {filtersProps && <FiltersTrigger {...filtersProps} />}
          </Flex>
          {
            <Flex className="gap-2" align="center">
              {actions}
            </Flex>
          }
        </Flex>
        {filtersProps && <FiltersContent {...filtersProps} />}
        <Flex
          className={cn('overflow-hidden', headerBottomBorder && 'p-3', bodyClassName)}
          direction="column"
          fullHeight
          fullWidth
        >
          {children}
        </Flex>
      </Flex>
    );
  },
);
