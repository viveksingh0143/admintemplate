import PageHeader from "@components/ui/pageHeader";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { ContainerTypes, containerColumns } from "./containersDef";
import TabGroup, { TabType } from "@components/ui/tabs";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon, PencilIcon, PrinterIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useContainerList } from "@hooks/warehouse/containers/containersHooks";
import { ButtonProps } from "@components/ui/button";
import { useNotification } from "@hooks/notificationContext";


const tabs: TabType[] = Object.values(ContainerTypes).map(t => ({ name: t }));

const ContainerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { setShowNotification } = useNotification();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useContainerList(pageNumber, rowsPerPage, sortingOrder, { type: currentTab.name });
  
  const isRowsSelected = rowSelection.length;

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/containers/${row.original.id}`)} />
        <Button variant="warning" icon={<PencilIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/containers/${row.original.id}/edit`)} />
        {/* <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/containers/${row.original.id}`)} /> */}
        <Button variant="info" icon={<PrinterIcon className="h-4 w-3 rounded-full" />} onClick={() => printStickers(1)} />
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

  const printStickers = (count: number) => {
    setShowNotification(count + ' sticker sent to printer', 'success');
  }

  const memoizedActionsOnSelection = useMemo<ButtonProps[]>(() => {
    if (rowSelection.length > 0) {
      return [
        { label: "Print Sticker", variant: "secondary", className: "text-xs px-3 py-0", onClick: () => printStickers(rowSelection.length) }
      ];
    } else {
      return [];
    }
  }, [isRowsSelected]);

  return (
    <>
      <PageHeader
        label="Containers"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Containers" }]}
        actions={[
          { label: "Create Container", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/containers/create") },
          ...memoizedActionsOnSelection
        ]}
        className="px-4"
      >
        <TabGroup tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} label="Select a tab" />
      </PageHeader>
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

export default ContainerListPage;