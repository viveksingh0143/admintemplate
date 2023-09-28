import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const containerColumns: ColumnDef<any, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox {...{ checked: table.getIsAllRowsSelected(), indeterminate: table.getIsSomeRowsSelected(), onChange: table.getToggleAllRowsSelectedHandler() }} />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox {...{ checked: row.getIsSelected(), disabled: !row.getCanSelect(), indeterminate: row.getIsSomeSelected(), onChange: row.getToggleSelectedHandler() }} />
      </div>
    ),
  },
  {
    accessorKey: "code",
    enableSorting: true,
    header: "Code",
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: "Name",
    cell: (props) => {
      return (
        <>
          <div>{props.getValue()}</div>
          <div>{props?.row?.original?.address}</div>
        </>
      );
    },
  },
  {
    accessorKey: "stock_level",
    enableSorting: true,
    header: "Stock Level",
    cell: (row: any) => {
      return (
        <Chip className="text-xs py-1 px-2" label={row?.getValue()?.toUpperCase()} variant={row.getValue() === "EMPTY" ? "success" : "warning"} />
      );
    },
  },
  {
    accessorKey: "approved",
    enableSorting: true,
    header: "Is Approved",
    cell: (row: any) => {
      return (
        <Chip
          className="text-xs py-1 px-2"
          label={row?.getValue() ? 'YES' : 'NO'}
          variant={row.getValue() ? "success" : "warning"} />
      );
    }
  },
  {
    accessorKey: "status",
    enableSorting: true,
    header: "Status",
    cell: (row: any) => {
      return (
        <Chip className="text-xs py-1 px-2" label={row?.getValue()?.toUpperCase()} variant={row.getValue() === "ENABLE" ? "success" : "warning"} />
      );
    },
  },
  {
    accessorKey: "item_info",
    header: "Item Info",
    enableSorting: false,
    cell: (props: any) => {
      if (props?.row?.original?.item_info) {
        return (
          <div className="items-center">
            <div className="font-semibold">{props.row.original.item_info?.name}</div>
            <div className="text-sm font-semibold">#{props.row.original.item_info?.code}</div>
            <div className="text-sm">{props.row.original.item_info?.type}</div>
            <div className="text-sm">Item Count: {props.row.original.item_info?.count}</div>
          </div>
        );
      } else {
        return null;
      }
    },
  }
];
