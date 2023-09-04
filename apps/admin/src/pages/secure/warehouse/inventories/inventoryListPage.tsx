import PageHeader from "@components/ui/pageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductList } from "@hooks/products/productsHooks";
import BasicTable from "@components/ui/basicTable";
import TabGroup, { TabType } from "@components/ui/tabs";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon } from "@heroicons/react/20/solid";
import { productColumns } from "@pages/secure/products/productsDef";

const tabs: TabType[] = [{ name: "RAW Material" }, { name: "Finished Goods" }];

const InventoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useProductList(pageNumber, rowsPerPage, sortingOrder, { type: currentTab.name });

  // const actionsColumn: ColumnDef<any> = {
  //   accessorKey: "actions",
  //   enableSorting: false,
  //   header: "Actions",
  //   cell: ({ row }) => (
  //     <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
  //       <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/inventories/${row.original.id}`)} />
  //     </span>
  //   ),
  // };

  const stockColumn: ColumnDef<any> = {
    accessorKey: "stocks",
    enableSorting: false,
    header: "Stocks",
    cell: ({ row }) => Math.floor(Math.random() * 100),
  };

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };

  const handleTabClick = (selectedTab: TabType) => {
    setCurrentTab(selectedTab);
  };

  const navigateStockIn = () => {
    if (currentTab.name === "RAW Material") {
      navigate("/secure/warehouse/inventories/stockin-raw-material")
    } else {
      navigate("/secure/warehouse/inventories/stockin-finished-goods")
    }
  }

  return (
    <>
      <PageHeader
        label="Inventories"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }]}
        actions={[{ label: "Stock In", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigateStockIn() }]}
        className="px-4"
      >
        <TabGroup tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} label="Select a tab" />
      </PageHeader>
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...productColumns, stockColumn]}
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