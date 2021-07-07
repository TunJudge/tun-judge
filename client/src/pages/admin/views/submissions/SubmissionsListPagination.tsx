import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
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
  <tfoot>
    <tr>
      <th colSpan={8}>
        <div className="flex justify-end p-3 w-full">
          <div className="flex text-gray-600 bg-white">
            <div
              title="First page"
              className="p-2 border border-r-0 border-gray-400 rounded-l-md cursor-pointer hover:bg-gray-100"
              onClick={() => setCurrentPage(0)}
            >
              <ChevronDoubleLeftIcon className="w-6 h-6" />
            </div>
            <div
              title="Previous page"
              className="p-2 border border-r-0 border-gray-400 cursor-pointer hover:bg-gray-100"
              onClick={() => currentPage && setCurrentPage(currentPage - 1)}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </div>
            {new Array(Math.ceil(totalItems / 10)).fill(0).map((_, index) => (
              <div
                key={`page-${index}`}
                title={`Page ${index + 1}`}
                className="p-2 px-4 border border-r-0 border-gray-400 cursor-pointer hover:bg-gray-100"
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </div>
            ))}
            <div
              title="Next page"
              className="p-2 border border-r-0 border-gray-400 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                currentPage + 1 < Math.ceil(totalItems / 10) && setCurrentPage(currentPage + 1)
              }
            >
              <ChevronRightIcon className="w-6 h-6" />
            </div>
            <div
              title="Last page"
              className="p-2 border border-gray-400 rounded-r-md cursor-pointer hover:bg-gray-100"
              onClick={() => setCurrentPage(Math.ceil(totalItems / 10) - 1)}
            >
              <ChevronDoubleRightIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </th>
    </tr>
  </tfoot>
);

export default SubmissionsListPagination;
