import { ChevronRightIcon, LucideIcon } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, FlexProps, Separator, Sidebar, cn } from 'tw-react-components';

import { FiltersContent, FiltersProps, FiltersTrigger } from './filters';

type BreadCrumbProps = {
  title: ReactNode;
  to?: string;
  onClick?: () => void;
  hide?: boolean;
};

type Props = Omit<FlexProps, 'title'> & {
  icon?: LucideIcon;
  title?: ReactNode;
  breadcrumbs?: BreadCrumbProps[];
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
      breadcrumbs = [],
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
          className={cn(headerBottomBorder && 'border-b p-3')}
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
            {Icon && (
              <Icon
                className={cn(
                  'ml-2 mr-2 h-5 w-5 flex-shrink-0',
                  breadcrumbs.filter((breadcrumb) => !breadcrumb.hide).length && 'mr-0',
                )}
              />
            )}
            {breadcrumbs
              .filter((breadcrumb) => !breadcrumb.hide)
              .map((breadcrumb, index) => (
                <Flex key={index} className="gap-0" align="center">
                  {breadcrumb.to ? (
                    <Link to={breadcrumb.to} onClick={breadcrumb.onClick}>
                      <Button className="text-xl" variant="text">
                        {breadcrumb.title}
                      </Button>
                    </Link>
                  ) : (
                    <span onClick={breadcrumb.onClick}>{breadcrumb.title}</span>
                  )}
                  <ChevronRightIcon className="h-5 w-5" />
                </Flex>
              ))}
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
