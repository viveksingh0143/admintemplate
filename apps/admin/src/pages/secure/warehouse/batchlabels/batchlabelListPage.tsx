import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { ButtonProps } from "@components/ui/button";
import { PrinterIcon } from "@heroicons/react/24/outline";
import SideOver from "@components/ui/sideOvers";
import BatchPrintForm from "./components/batchPrintForm";
import { format } from "date-fns";
import { useNotification } from "@hooks/notificationContext";
import { useAxiosMutation, useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import AxiosService from "@services/axiosService";
import { API_URLS } from "@configs/constants/apiUrls";
import { batchlabelColumns } from "./batchlabelsDef";

const BatchListPage: React.FC = () => {
  const [isOpenSideOver, setIsOpenSideOver] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.WAREHOUSE.BATCH_LABEL_API, pageNumber, rowsPerPage, sortingOrder, {});

  const isRowsSelected = rowSelection.length;

  const deleteMutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (Array.isArray(data)) {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}/bulkdelete`, { ids: data });
      } else {
        response = await AxiosService.getInstance().axiosInstance.delete(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}/${data}`);
      }
      return response?.data;
    },
    (data) => { setShowNotification('Records deleted successfully', 'success'); },
    (errors) => { setShowNotification('Records deletion failed', 'danger'); }
  );

  const deleteAllSelected = (selectedRows: any[]) => {
    const batchlabelIds = selectedRows.map(row => row.id);
    if (window.confirm(`Are you sure you want to delete ${batchlabelIds.length} batch labels?`)) {
      deleteMutation.mutate(batchlabelIds);
    }
  };

  const deleteSelected = (selectedRow: any) => {
    if (window.confirm(`Are you sure you want to delete ${selectedRow.name} batch label?`)) {
      deleteMutation.mutate(selectedRow.id);
    }
  };

  const printStickers = (row: any) => {
    setSelectedBatch(row)
    setIsOpenSideOver(true)
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <>
        <div>
          <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
            <Button variant="info" icon={<PrinterIcon className="h-4 w-3 rounded-full" />} onClick={() => printStickers(row.original)} />
            <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/batchlabels/${row.original.id}`)} />
            <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/batchlabels/${row.original.id}/edit`)} />
            <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => deleteSelected(row.original)} />
          </span>
        </div>
        <div className="mt-1">
          <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
            <Button className="text-xs" variant="info" label="Zero Print" icon={<PrinterIcon className="h-4 w-3 rounded-full inline-flex mr-1" />} onClick={() => setShowNotification('Your zero sticker printed successfully', 'success')} />
          </span>
        </div>
      </>
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
      <SideOver title="Label Print" isOpen={isOpenSideOver} onClose={() => setIsOpenSideOver(false)}>
        <div className="overflow-hidden">
          <BatchPrintForm batch={selectedBatch} onClose={() => setIsOpenSideOver(false)} />
          { selectedBatch ? (
            <div className="mt-10 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Batch Date</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.batch_date }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Batch Number</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.batch_no }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">SO Number</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.so_number || "NA" }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Target Quantity</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.target_quantity }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">PO Category</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.po_category || "NA" }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Unit Weight</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.unit_weight } { selectedBatch.unit_weight_type }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Package Quantity</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.package_quantity }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Labels To Print</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.labels_to_print }</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">Total Printed</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ selectedBatch.total_printed }</dd>
                </div>
              </dl>
            </div>
          ) : null }
        </div>
      </SideOver>
      <PageHeader
        label="Batch (Packaging Labels)"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stores" }]}
        actions={[
          { label: "Create Batch", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/batchlabels/create") },
          ...memoizedActionsOnSelection
        ]}
        className="px-4"
      />
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...batchlabelColumns, actionsColumn]}
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

export default BatchListPage;
