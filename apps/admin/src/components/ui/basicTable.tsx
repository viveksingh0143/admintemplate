import { Cell, ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { debounce } from "lodash";
import { ChangeEvent, FC, memo, useMemo, useState } from "react";
import Pagination from "./pagination";

interface TableProps {
  data: any[];
  columns: ColumnDef<any>[];
  isFetching?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  rowsPerPage: number;
  pageCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onClickRow?: (cell: Cell<any, unknown>, row: Row<any>) => void;
}

const Table: FC<TableProps> = ({
  data,
  columns,
  isFetching,
  skeletonCount = 10,
  skeletonHeight = 28,
  rowsPerPage,
  pageCount,
  onClickRow,
  onPageChange,
}) => {
  const [paginationPage, setPaginationPage] = useState(1);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);

  const columnCount = getAllColumns().length;

  const noDataFound =
    !isFetching && (!memoizedData || memoizedData.length === 0);

  const handlePageChange = (currentPage: number) => {
    setPaginationPage(currentPage === 0 ? 1 : currentPage);
    onPageChange?.((currentPage === 0 ? 1 : currentPage), rowsPerPage);
  };

  return (
    <div className="shadow-lg bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          {!isFetching && (
            <thead className="bg-primary-50">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody className="divide-y divide-gray-200 bg-white">
            {!isFetching ? (
              getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      onClick={() => onClickRow?.(cell, row)}
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <>
                {skeletons.map((skeleton) => (
                  <tr key={skeleton}>
                    {Array.from({ length: columnCount }, (x, i) => i).map(
                      (elm) => (
                        <td key={elm}>
                          <div className="bg-gray-300 animate-pulse" style={{ height: `${skeletonHeight}px` }} />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      {noDataFound && (
        <div className="my-4 text-center">
          No Data Found
        </div>
      )}
      {pageCount !== undefined && onPageChange && (
        <div className="flex justify-center items-center">
          <Pagination rowsPerPage={rowsPerPage} currentPage={paginationPage} totalPages={pageCount} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default memo(Table);