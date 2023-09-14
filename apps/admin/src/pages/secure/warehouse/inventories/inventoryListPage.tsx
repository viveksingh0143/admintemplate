import PageHeader from "@components/ui/pageHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import TabGroup, { TabType } from "@components/ui/tabs";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon } from "@heroicons/react/20/solid";
import { useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import { inventoryColumns } from "./inventoryDef";

const InventoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType | null | undefined>(null);
  const [requestQueryParams, setRequestQueryParams] = useState({});
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: storeData, isLoading: isStoreLoading, error: storeError } = useAxiosQueryWithParams(API_URLS.MASTER.STORE_API, 1, 100, "", { status: 1 });
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.WAREHOUSE.INVENTORY_API, pageNumber, rowsPerPage, sortingOrder, requestQueryParams, currentTab != null);

  const handleTabClick = (selectedTab: TabType) => {
    const tabParams = selectedTab.data || {}
    setRequestQueryParams({ ...tabParams })
    setCurrentTab(selectedTab);
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/inventories/${row.original.id}/stocks`)} />
      </span>
    ),
  };

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };

  useEffect(() => {
    if (storeData?.data?.length) {
      const newTabs = storeData?.data?.map((store: any) => ({
        name: store.name,
        data: { product_types: store.store_types }
      })) || [];
      setTabs(newTabs);
      setCurrentTab(newTabs[0])
      handleTabClick(newTabs[0])
    }
  }, [storeData]);

  return (
    <>
      <PageHeader
        label="Inventories"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Inventories" }]}
        actions={[
          { label: "Add Stock", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/inventories/stockin-raw-material") }
        ]}
        className="px-4"
      >
        <TabGroup tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} label="Select a tab" />
      </PageHeader>
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...inventoryColumns, actionsColumn]}
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

export default InventoryListPage;