import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { ButtonProps } from "@components/ui/button";
import { useNotification } from "@hooks/notificationContext";
import { useAxiosMutation, useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";
import TabGroup, { TabType } from "@components/ui/tabs";
import { joborderColumns } from "./jobordersDef";

const JobOrderListPage: React.FC = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.MASTER.JOB_ORDER_API, pageNumber, rowsPerPage, sortingOrder, { });

  const isRowsSelected = rowSelection.length;

  const deleteMutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (Array.isArray(data)) {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.JOB_ORDER_API}/bulkdelete`, { ids: data });
      } else {
        response = await AxiosService.getInstance().axiosInstance.delete(`${API_URLS.MASTER.JOB_ORDER_API}/${data}`);
      }
      return response?.data;
    },
    (data) => { setShowNotification('Records deleted successfully', 'success'); },
    (errors) => { setShowNotification('Records deletion failed', 'danger'); }
  );

  const deleteAllSelected = (selectedRows: any[]) => {
    const containerIds = selectedRows.map(row => row.id);
    if (window.confirm(`Are you sure you want to delete ${containerIds.length} job orders?`)) {
      deleteMutation.mutate(containerIds);
    }
  };

  const deleteSelected = (selectedRow: any) => {
    if (window.confirm(`Are you sure you want to delete ${selectedRow.name} job order?`)) {
      deleteMutation.mutate(selectedRow.id);
    }
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/master/joborders/${row.original.id}`)} />
        <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/master/joborders/${row.original.id}/edit`)} />
        <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => deleteSelected(row.original)} />
      </span>
    ),
  };

  const memoizedActionsOnSelection = useMemo<ButtonProps[]>(() => {
    if (rowSelection.length > 0) {
      return [
        { label: "Delete All", variant: "danger", className: "text-xs px-3 py-0", onClick: () => deleteAllSelected(rowSelection) }
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
  
  return (
    <>
      <PageHeader
        label="Job Orders"
        breadcrumbs={[{ label: "Dashboard" }, { label: "JobOrders" }]}
        actions={[
          { label: "Create Job Order", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/joborders/create") },
          ...memoizedActionsOnSelection
        ]}
        className="px-4"
      />
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...joborderColumns, actionsColumn]}
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

export default JobOrderListPage;