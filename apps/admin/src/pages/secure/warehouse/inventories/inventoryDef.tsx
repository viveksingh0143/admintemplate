import { Chip, IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const inventoryColumns: ColumnDef<any, any>[] = [
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
    accessorKey: "stock_count",
    enableSorting: false,
    header: "Stock Count",
    cell: (props) => props?.getValue() || 0,
  },
  {
    accessorKey: "last_stock_in",
    enableSorting: true,
    header: "Last Stockin At",
    cell: (props) => props?.getValue() || "NA",
  }
];
