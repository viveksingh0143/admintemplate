import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useStoreList } from "@hooks/warehouse/stores/storesHooks";
import { storeColumns } from "./storesDef";
import { ButtonProps } from "@components/ui/button";

const StoreListPage: React.FC = () => {
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useStoreList(pageNumber, rowsPerPage, sortingOrder, {});

  const isRowsSelected = rowSelection.length;

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/stores/${row.original.id}`)} />
        <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/stores/${row.original.id}/edit`)} />
        <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/stores/${row.original.id}`)} />
      </span>
    ),
  };

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };
  const memoizedActionsOnSelection = useMemo<ButtonProps[]>(() => {
    if (rowSelection.length > 0) {
      return [
        { label: "Print QR", variant: "secondary", className: "text-xs px-3 py-0", onClick: () => {} }
      ];
    } else {
      return [];
    }
  }, [isRowsSelected]);

  return (
    <>
      <PageHeader
        label="Stores"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stores" }]}
        actions={[
          { label: "Create Store", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/stores/create") },
          ...memoizedActionsOnSelection
        ]}
        className="px-4"
      />
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...storeColumns, actionsColumn]}
          isFetching={isLoading}
          skeletonCount={5}
          rowsPerPage={rowsPerPage}
          pageCount={pageData?.total_pages}
          itemsCount={pageData?.total_items}
          onRowSelection={setRowSelection}
          onPageChange={onPageChange}
        />
      </div>
    </>
  )
};

export default StoreListPage;