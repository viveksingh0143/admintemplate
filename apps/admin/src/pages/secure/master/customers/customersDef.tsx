import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const customerColumns: ColumnDef<any, any>[] = [
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
  },
  {
    accessorKey: "contact_person",
    enableSorting: false,
    header: "Contact Person",
  },
  {
    accessorKey: "billing_address",
    enableSorting: false,
    header: "Billing Address",
    cell: (row: any) => {
      if (row?.getValue()?.state === "" && row?.getValue()?.country === "") return "NA";
      else return (
        <Chip className="text-xs py-2 px-4" label={`${row?.getValue()?.state?.toUpperCase()} ${row?.getValue()?.country?.toUpperCase()}`} variant={row.getValue() === "active" ? "success" : "warning"} />
      );
    },
  },
  {
    accessorKey: "shipping_address",
    enableSorting: false,
    header: "Shipping Address",
    cell: (row: any) => {
      if (row?.getValue()?.state === "" && row?.getValue()?.country === "") return "NA";
      else return (
        <Chip className="text-xs py-2 px-4" label={`${row?.getValue()?.state?.toUpperCase()} ${row?.getValue()?.country?.toUpperCase()}`} variant={row.getValue() === "active" ? "success" : "warning"} />
      );
    },
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
      return row?.getValue() ? row.getValue() : null;
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
