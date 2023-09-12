import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const userColumns: ColumnDef<any, any>[] = [
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
    accessorKey: "staff_id",
    enableSorting: true,
    header: "Staff ID",
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: "Name",
  },
  {
    accessorKey: "email",
    enableSorting: false,
    header: "E-Mail",
  },
  {
    accessorKey: "roles",
    enableSorting: false,
    header: "Role",
    cell: (row: any) => {
      return (
        <>
          { row?.getValue()?.map((role: any) => (
            <span className="mr-1" key={role.id}>{role.name}</span>
          ))}
        </>
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
