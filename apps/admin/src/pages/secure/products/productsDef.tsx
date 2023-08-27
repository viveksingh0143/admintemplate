import { Chip } from "@components/ui";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";


const columnHelper = createColumnHelper<any>();

export const productColumns: ColumnDef<any, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
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
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row: any) => {
      return (
        <Chip label={row.getValue()} variant={row.getValue() === "active" ? "success" : "warning"} />
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Meta Information",
    cell: (props) => {
      return (
        <>
          <div className="font-medium">Last Modified At</div>
          <div>{props.getValue()}</div>
          <div className="mt-1 font-medium">Last Modified By</div>
          <div>{props?.row?.original?.last_updated_by || "NA"}</div>
        </>
      );
    },
  },
];
