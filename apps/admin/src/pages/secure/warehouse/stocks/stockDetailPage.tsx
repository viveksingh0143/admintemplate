import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Chip } from "@components/ui";
import { format } from "date-fns";
import { useAxiosQuery } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";

const StockDetailPage: React.FC = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useAxiosQuery(`${API_URLS.WAREHOUSE.STOCK_API}/${id}`);

  return (
    <>
      <PageHeader
        label="Stock Detail"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stocks" }]}
        actions={[
          { label: "List Stocks", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate(`/secure/warehouse/inventories/${pageData?.product_id}/stocks`) }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Product Information</dt>
              <dd className="text-sm leading-6 text-gray-700 sm:col-span-2">
                <div className="sm:grid sm:grid-cols-10 sm:gap-4">
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 font-semibold">Name</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.product?.name}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 font-semibold">Code</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.product?.code}</div>

                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 font-semibold">Product Type</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.product?.product_type}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 font-semibold">Unit</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.product?.unit_type}</div>
                  {pageData?.product?.unit_type === "Piece" && (
                    <>
                      <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 font-semibold">Unit Weight</div>
                      <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.product?.unit_weight} {pageData?.product?.unit_weight_type}</div>
                    </>
                  )}
                </div>
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Store Information</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="sm:grid sm:grid-cols-10 sm:gap-4">
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Name</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.store?.name}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Code</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.store?.code}</div>

                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Store Type</div>
                  <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.store?.store_types}</div>
                </div>
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Barcode</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.barcode}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Batch No.</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.batch_no}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Unit Weight</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.unit_weight}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Quantity</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.quantity}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Machine Code</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.machine_code}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Stockin At</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.stockin_at}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Stockout At</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.stockout_at}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.status}</dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Pallet</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.pallet?.code || "Not Attached"}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Bin</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.bin?.code || "Not Attached"}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Rack</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.rack?.code || "Not Attached"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
};

export default StockDetailPage;