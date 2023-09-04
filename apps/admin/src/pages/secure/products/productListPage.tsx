import PageHeader from "@components/ui/pageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductList } from "@hooks/products/productsHooks";
import BasicTable from "@components/ui/basicTable";
import { productColumns } from "./productsDef";
import TabGroup, { TabType } from "@components/ui/tabs";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

const tabs: TabType[] = [{ name: "RAW Material" }, { name: "Finished Goods" }];

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useProductList(pageNumber, rowsPerPage, sortingOrder, { type: currentTab.name });

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/products/${row.original.id}`)} />
        <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/products/${row.original.id}/edit`)} />
        {/* <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/products/${row.original.id}`)} /> */}
      </span>
    ),
  };

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };

  const handleTabClick = (selectedTab: TabType) => {
    setCurrentTab(selectedTab);
  };

  return (
    <>
      <PageHeader
        label="Products"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }]}
        actions={[{ label: "Create Product", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/products/create") }]}
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