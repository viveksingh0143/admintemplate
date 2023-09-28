import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import BasicTable from "@components/ui/basicTable";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Chip } from "@components/ui";
import { PencilIcon } from "@heroicons/react/20/solid";
import { ButtonProps } from "@components/ui/button";
import { containerColumns } from "./rawMaterialApprovalsDef";
import { useNotification } from "@hooks/notificationContext";
import { useAxiosMutation, useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";

const RawMaterialApprovalListPage: React.FC = () => {
  const { setShowNotification } = useNotification();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.MASTER.PALLET_NEED_APPROVALS_API, pageNumber, rowsPerPage, sortingOrder, { container_type: CommonConstant.CONTAINER.PALLET });

  const isRowsSelected = rowSelection.length;

  const approveMutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (Array.isArray(data)) {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.MASTER.PALLET_NEED_APPROVALS_API, { ids: data });
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(API_URLS.MASTER.PALLET_NEED_APPROVALS_API, { ids: [data] });
      }
      return response?.data;
    },
    (data) => { setShowNotification('Pallets approved successfully', 'success'); },
    (errors) => { setShowNotification('Pallets approval failed', 'danger'); }
  );

  const approveAllSelected = (selectedRows: any[]) => {
    const containerIds = selectedRows.map(row => row.id);
    if (window.confirm(`Are you sure you want to approve all stocks inside ${containerIds.length} pallets?`)) {
      approveMutation.mutate(containerIds);
    }
  };

  const approveStocks = (selectedRow: any) => {
    if (window.confirm(`Are you sure you want to approve all stocks inside ${selectedRow.code} pallet?`)) {
      approveMutation.mutate(selectedRow.id);
    }
  };

  const memoizedActionsOnSelection = useMemo<ButtonProps[]>(() => {
    if (rowSelection.length > 0) {
      return [
        { label: "APPROVE ALL", variant: "info", className: "text-xs px-3 py-0", onClick: () => approveAllSelected(rowSelection) }
      ];
    } else {
      return [];
    }
  }, [isRowsSelected]);

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row: props }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="info" label="APPROVE" className="inline" icon={<PencilIcon className="h-4 w-3 rounded-full inline-flex mr-1" />} onClick={() => approveStocks(props.original)} />
      </span>
    ),
  }
  
  return (
    <>
      <PageHeader
        label="Raw Material Approvals"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Pallets" }]}
        actions={[
          ...memoizedActionsOnSelection
        ]}
        className="px-4"
      />
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...containerColumns, actionsColumn]}
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

export default RawMaterialApprovalListPage;