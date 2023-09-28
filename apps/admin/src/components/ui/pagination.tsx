import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';
import Button from './button';
import { Select } from '@components/form';
import SelectBasic from '@components/form/selectBasic';

interface PaginationProps {
  rowsPerPage: number;
  currentPage: number;
  totalPages: number;
  itemsCount: number | undefined;
  onPageChange: (page: number) => void;
  onRowsSizeChange: (rowSize: number) => void;
  exportCSV: () => void;
};

const Pagination: React.FC<PaginationProps> = ({ rowsPerPage, currentPage, totalPages, itemsCount = 0, onPageChange, onRowsSizeChange, exportCSV }) => {
  const updateRowsSize = (val: string | number) => {
    const numericVal = typeof val === 'string' ? parseFloat(val) : val;
    if (!isNaN(numericVal)) {
      onRowsSizeChange(numericVal);
    }
  };
  
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <a
          key={i}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i);
          }}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            i === currentPage
              ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }`}
        >
          {i}
        </a>,
      );
    }
    return pages;
  };

  return (
    <div className="w-full flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
            <Button className='text-xs' variant="info" label='EXPORT AS CSV' onClick={() => exportCSV()} />
            <div className='flex ml-2'>
              <button type="button" className="relative bg-info -mr-px inline-flex items-center gap-x-1.5 rounded-l-md px-3 py-2 text-sm font-semibold text-white">Rows Per Page</button>
              <SelectBasic onValueChange={updateRowsSize} selectClassName="-ml-px rounded-r-md rounded-l-none" name='pageSize' hideLabel={true} options={[10, 20, 50, 100, 200, 500]} value={rowsPerPage} />
            </div>
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> | 
            Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * rowsPerPage, itemsCount)}</span> of{' '}
            <span className="font-medium">{itemsCount}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          {(currentPage < 1) ? (null) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            )}
            {renderPageNumbers()}
            
            {(currentPage >= totalPages) ? (null) : (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
