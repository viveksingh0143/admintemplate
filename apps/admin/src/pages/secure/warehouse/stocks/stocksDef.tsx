import { IndeterminateCheckbox } from "@components/ui";
import { ColumnDef } from "@tanstack/react-table";

export const stockColumns: ColumnDef<any, any>[] = [
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
    accessorKey: "batch_no",
    enableSorting: true,
    header: "Batch No.",
  },
  {
    accessorKey: "barcode",
    enableSorting: false,
    header: "Barcode",
  },
  {
    accessorKey: "unit_weight",
    enableSorting: false,
    header: "Unit Weight",
  },
  {
    accessorKey: "quantity",
    enableSorting: false,
    header: "Quantity",
  },
  {
    accessorKey: "stockin_at",
    enableSorting: true,
    header: "Stockin At",
    cell: (row: any) => {
      return row?.getValue() ? row.getValue() : null;
    },
  },
  {
    accessorKey: "stockout_at",
    enableSorting: true,
    header: "Stockin Out",
    cell: (row: any) => {
      return row?.getValue() ? row.getValue() : null;
    },
  },
  {
    accessorKey: "status",
    enableSorting: true,
    header: "Status",
    cell: (row: any) => {
      return row?.getValue() ? row.getValue() : null;
    },
  }
];
