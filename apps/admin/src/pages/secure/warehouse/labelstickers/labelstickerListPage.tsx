import PageHeader from "@components/ui/pageHeader";
import BasicTable from "@components/ui/basicTable";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonConstant } from "@configs/constants/common";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui";
import { EyeIcon } from "@heroicons/react/20/solid";
import { useNotification } from "@hooks/notificationContext";
import { useAxiosQueryWithParams } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import { labelstickerColumns } from "./labelstickersDef";
import { useQuery } from "@hooks/useQuery";

const LabelStickerListPage: React.FC = () => {
  const searchQuery = useQuery();
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState<any[]>([]);
  const [sortingOrder, setSortingOrder] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(CommonConstant.PAGE_INFO.PAGE_SIZE);
  const { data: pageData, isLoading, error } = useAxiosQueryWithParams(API_URLS.WAREHOUSE.LABEL_STICKER_API, pageNumber, rowsPerPage, sortingOrder, { batchlabel_id: searchQuery?.get('batch') });

  const isRowsSelected = rowSelection.length;

  const printStickers = (row: any) => {
  };

  const actionsColumn: ColumnDef<any> = {
    accessorKey: "actions",
    enableSorting: false,
    header: "Actions",
    cell: ({ row }) => (
      <span className="isolate inline-flex rounded-md shadow-sm text-xs gap-1">
        <Button variant="primary" icon={<EyeIcon className="h-4 w-3 rounded-full" />} onClick={() => navigate(`/secure/warehouse/labelstickers/${row.original.id}`)} />
      </span>
    ),
  };

  const onPageChange = (pageNumber: number, rowsPerPage: number, sortingOrder: string) => {
    setRowsPerPage(rowsPerPage);
    setPageNumber(pageNumber);
    setSortingOrder(sortingOrder);
  };

  return (
    <>
      <PageHeader
        label="Label Sticker"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Label Stickers" }]}
        actions={[]}
        className="px-4"
      />
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData ? pageData.data : []}
          columns={[...labelstickerColumns, actionsColumn]}
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

export default LabelStickerListPage;
