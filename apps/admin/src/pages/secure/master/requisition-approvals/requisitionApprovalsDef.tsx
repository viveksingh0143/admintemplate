import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const requisitionColumns: ColumnDef<any, any>[] = [
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
    accessorKey: "order_no",
    enableSorting: true,
    header: "Requisition No.",
  },
  {
    accessorKey: "department",
    enableSorting: true,
    header: "Department",
  },
  {
    accessorKey: "issued_date",
    enableSorting: true,
    header: "Batch Date",
    cell: (row: any) => {
      return row?.getValue();
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
          variant={row.getValue() ? "success" : "warning"}
          />
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
    accessorKey: "updated_at",
    header: "Last Modified At",
    enableSorting: true,
    cell: (row: any) => {
      return row?.getValue();
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
