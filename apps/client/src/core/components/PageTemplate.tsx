import { LucideIcon } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';
import { Flex, FlexProps, Separator, Sidebar, cn } from 'tw-react-components';

import { FiltersContent, FiltersProps, FiltersTrigger } from './filters';

type Props = Omit<FlexProps, 'title'> & {
  icon?: LucideIcon;
  title?: ReactNode;
  actions?: ReactNode;
  bodyClassName?: string;
  filtersProps?: FiltersProps;
  headerBottomBorder?: boolean;
  isSubSection?: boolean;
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
      isSubSection,
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
          <Flex className="gap-2 text-xl" align="center" fullWidth>
            {!isSubSection && (
              <>
                <Sidebar.Trigger />
                {(Icon || title || filtersProps) && (
                  <Separator className="h-7" orientation="vertical" decorative />
                )}
              </>
            )}
            {Icon && <Icon className="ml-2 mr-1 h-5 w-5" />}
            {title}
            {filtersProps && <FiltersTrigger {...filtersProps} />}
          </Flex>
          {actions && (
            <Flex className="gap-2" align="center">
              {actions}
            </Flex>
          )}
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
