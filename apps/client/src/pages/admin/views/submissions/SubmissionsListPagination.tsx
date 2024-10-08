import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

type Props = {
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const SubmissionsListPagination: React.FC<Props> = ({
  currentPage,
  totalItems,
  setCurrentPage,
}) => (
  <tr>
    <th colSpan={8}>
      <div className="flex w-full justify-end p-3">
        <div className="flex rounded-md bg-white dark:bg-gray-800">
          <div
            title="First page"
            className="cursor-pointer rounded-l-md border border-r-0 border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage(0)}
          >
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          </div>
          <div
            title="Previous page"
            className="cursor-pointer border border-r-0 border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => currentPage && setCurrentPage(currentPage - 1)}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </div>
          {new Array(Math.ceil(totalItems / 10)).fill(0).map((_, index) => (
            <div
              key={`page-${index}`}
              title={`Page ${index + 1}`}
              className={classNames(
                'cursor-pointer border border-r-0 border-gray-400 p-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-600',
                {
                  'bg-gray-100 dark:bg-gray-700': index === currentPage,
                },
              )}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </div>
          ))}
          <div
            title="Next page"
            className="cursor-pointer border border-r-0 border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() =>
              currentPage + 1 < Math.ceil(totalItems / 10) && setCurrentPage(currentPage + 1)
            }
          >
            <ChevronRightIcon className="h-6 w-6" />
          </div>
          <div
            title="Last page"
            className="cursor-pointer rounded-r-md border border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() =>
              setCurrentPage(
                Math.floor(
                  totalItems && !(totalItems % 10) ? (totalItems - 1) / 10 : totalItems / 10,
                ),
              )
            }
          >
            <ChevronDoubleRightIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </th>
  </tr>
);

export default SubmissionsListPagination;
