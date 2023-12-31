import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<any, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
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
          <div>{props?.row?.original?.description}</div>
        </>
      );
    },
  },
  {
    accessorKey: "unit_type",
    enableSorting: false,
    header: "Unit",
    cell: (props) => props?.getValue(),
  },
  {
    accessorKey: "unit_weight",
    enableSorting: false,
    header: "Unit Weight",
    cell: (props) => props?.getValue() ? `${props?.getValue()} ${props?.row?.original?.unit_weight_type}` : null,
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
