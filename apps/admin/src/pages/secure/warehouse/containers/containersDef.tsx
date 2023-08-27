import { Chip } from "@components/ui";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

export const ContainerTypes = {
  PALLET: "PALLET",
  BIN: "BIN",
  RACK: "RACK"
}

const columnHelper = createColumnHelper<any>();

export const containerColumns: ColumnDef<any, any>[] = [
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
          <div>{props?.row?.original?.address}</div>
        </>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row: any) => {
      return (
        <Chip label={row.getValue().toUpperCase()} variant={row.getValue() === "active" ? "success" : "warning"} />
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
