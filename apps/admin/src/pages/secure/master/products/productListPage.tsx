import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { productColumns } from "./productsDef";
import TabGroup, { TabType } from "@components/ui/tabs";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useNotification } from "@hooks/notificationContext";
import { useAxiosMutation, useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import AxiosService from "@services/axiosService";
import { ButtonProps } from "@components/ui/button";

const ProductListPage: React.FC = () => {
  const tabs: TabType[] = CommonConstant.PRODUCT.RAW_MATERIAL_SUBTYPES.concat(CommonConstant.PRODUCT.FINISHED_GOODS_SUBTYPES).map((pType: string) => ({ name: pType }));
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.MASTER.PRODUCT_API, pageNumber, rowsPerPage, sortingOrder, { product_subtype: currentTab.name });

  const isRowsSelected = rowSelection.length;

  const deleteMutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (Array.isArray(data)) {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.PRODUCT_API}/bulkdelete`, { ids: data });
      } else {
        response = await AxiosService.getInstance().axiosInstance.delete(`${API_URLS.MASTER.PRODUCT_API}/${data}`);
      }
      return response?.data;
    },
    (data) => { setShowNotification('Records deleted successfully', 'success'); },
    (errors) => { setShowNotification('Records deletion failed', 'danger'); }
  );

  const deleteAllSelected = (selectedRows: any[]) => {
    const productIds = selectedRows.map(row => row.id);
    if (window.confirm(`Are you sure you want to delete ${productIds.length} products?`)) {
      deleteMutation.mutate(productIds);
    }
  };

  const deleteSelected = (selectedRow: any) => {
    if (window.confirm(`Are you sure you want to delete ${selectedRow.name} product?`)) {
      deleteMutation.mutate(selectedRow.id);
    }
  };

  const handleTabClick = (selectedTab: TabType) => {
    setCurrentTab(selectedTab);
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/master/products/${row.original.id}`)} />
        <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/master/products/${row.original.id}/edit`)} />
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
        label="Master Products"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }]}
        actions={[{ label: "Create Product", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/products/create") }]}
        className="px-4"
      >
        <TabGroup tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} label="Select a tab" />
      </PageHeader>
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...productColumns, actionsColumn]}
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

export default ProductListPage;