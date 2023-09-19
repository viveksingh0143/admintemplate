import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const labelstickerColumns: ColumnDef<any, any>[] = [
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
    accessorKey: "uuid",
    enableSorting: true,
    header: "UUID",
  },
  {
    accessorKey: "packet_no",
    enableSorting: false,
    header: "Packet No.",
    cell: (row: any) => {
      return row?.getValue();
    },
  },
  {
    accessorKey: "print_count",
    enableSorting: false,
    header: "Print Count",
    cell: (row: any) => {
      return row?.getValue();
    },
  },
  {
    accessorKey: "shift",
    enableSorting: false,
    header: "Work Shift",
    cell: (row: any) => {
      return row?.getValue();
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Modified At",
    enableSorting: true,
    cell: (row: any) => {
      return row?.getValue();
    },
  },
  {
    accessorKey: "is_used",
    enableSorting: true,
    header: "Used",
    cell: (row: any) => {
      return (
        <Chip className="text-xs py-1 px-2" label={row?.getValue() ? "Yes" : "No"} variant={row.getValue() ? "warning" : "success"} />
      );
    },
  },
  {
    accessorKey: "last_updated_by",
    header: "Last Modified By",
    enableSorting: true,
    cell: (props) => {
      return (<div>{props.getValue()}</div>);
    },
  }
];
