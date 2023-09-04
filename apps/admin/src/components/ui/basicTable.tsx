import { Cell, ColumnDef, flexRender, getCoreRowModel, Row, SortingState, useReactTable } from "@tanstack/react-table";
import { FC, memo, useEffect, useMemo, useState } from "react";
import Pagination from "./pagination";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { classNames } from "@lib/utils";
import Button from "./button";

interface RowSelection {
  [rowId: string]: boolean;
}

interface BasicTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  isFetching?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  rowsPerPage: number;
  pageCount?: number;
  itemsCount?: number;
  onRowSelection?: (selectedRows: any[]) => void;
  onPageChange?: (page: number, pageSize: number, sorting: string) => void;
  onClickRow?: (cell: Cell<any, unknown>, row: Row<any>) => void;
}

const BasicTable: FC<BasicTableProps> = ({ data, columns, isFetching, skeletonCount = 10, skeletonHeight = 28, rowsPerPage, pageCount, itemsCount, onRowSelection, onClickRow, onPageChange }) => {
  const [rowSelection, setRowSelection] = useState<RowSelection>({});
  const [paginationPage, setPaginationPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  
  const tableInstance = useReactTable({ data: memoizedData, columns: memoizedColumns, state: { rowSelection, sorting }, enableRowSelection: true, onRowSelectionChange: setRowSelection, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), manualSorting: true, manualPagination: true, pageCount });
  
  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);
  const columnCount = tableInstance.getAllColumns().length;
  const noDataFound = !isFetching && (!memoizedData || memoizedData.length === 0);

  useEffect(() => {
    if (onRowSelection) {
      onRowSelection(tableInstance.getSelectedRowModel().flatRows.map((r) => r.original));
    }
  }, [rowSelection, onRowSelection]);

  useEffect(() => {
    if (pageCount === undefined || paginationPage === undefined || paginationPage < 1) setPaginationPage(1);
    else if (paginationPage > pageCount) setPaginationPage(pageCount);
    else setPaginationPage(paginationPage);
    const sortingOrder = sorting.map(s => `${s.id} ${s.desc ? "DESC" : "ASC"}`).join(", ");
    onPageChange?.(paginationPage, rowsPerPage, sortingOrder);

  }, [paginationPage, rowsPerPage, sorting]);
  
  return (
    <div className="shadow-lg bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          {!isFetching && (
            <thead>
              {tableInstance.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}
                      {...{
                        className: classNames("px-3 py-6 text-left text-sm font-semibold text-gray-900", header.column.getCanSort() ? 'cursor-pointer select-none' : '' ),
                        onClick: header.column.getCanSort() ? header.column.getToggleSortingHandler() : () => {},
                      }}
                    >
                      <div className="flex">
                        <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </span>
                        <span className="ml-2">
                        {{
                          asc: <ArrowDownIcon className="h-4 w-4" />,
                          desc: <ArrowUpIcon className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody className="divide-y divide-gray-200 bg-white">
            {!isFetching ? (
              tableInstance.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      onClick={() => onClickRow?.(cell, row)}
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-4 text-xs text-gray-500"
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
          <Pagination rowsPerPage={rowsPerPage} currentPage={paginationPage} totalPages={pageCount} onPageChange={setPaginationPage} itemsCount={itemsCount} />
        </div>
      )}
    </div>
  );
};

export default memo(BasicTable);