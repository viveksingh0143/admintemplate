import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Chip } from "@components/ui";
import { useBatchDetail } from "@hooks/warehouse/batches/batchesHooks";

const BatchDetailPage: React.FC = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useBatchDetail(id);

  return (
    <>
      <PageHeader
        label={`Batch Detail - ${pageData?.batch_no} (${pageData?.batch_date})`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Batchs" }]}
        actions={[
          { label: "Stickers List", variant: "info", className: "text-xs px-3 py-0", onClick: () => navigate({ pathname: "/secure/warehouse/labelstickers", search: "?batch=" + id }) },
          { label: "Edit Batch", variant: "info", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/batchlabels/" + id + "/edit") },
          { label: "List Batchs", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/batchlabels") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Batch Date</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.batch_date }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Batch Number</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.batch_no }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">SO Number</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.so_number || "NA" }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Target Quantity</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.target_quantity }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">PO Category</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.po_category || "NA" }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Unit Weight</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.unit_weight } { pageData?.unit_type }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Package Quantity</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.package_quantity }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Chip className="text-xs py-1 px-2" label={pageData?.status?.toUpperCase()} variant={pageData?.status === "ENABLE" ? "success" : "warning"} />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Product</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (pageData?.product && (
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Code</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                          <div>{ pageData?.product?.code }</div>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Name</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-right font-bold">{ pageData?.product?.name }</div>
                        <div>{ pageData?.product?.description }</div>
                      </div>
                    </li>
                  </ul>
                )) || "Not Available"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Customer</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (pageData?.customer && (
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Code</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                          <div>{ pageData?.customer?.code }</div>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Name</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-right font-bold">{ pageData?.customer?.name }</div>
                        <div>{ pageData?.customer?.contact_number }</div>
                      </div>
                    </li>
                  </ul>
                )) || "Not Available"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Machine</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (pageData?.machine && (
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Code</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                          <div>{ pageData?.machine?.code }</div>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Name</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-right font-bold">{ pageData?.machine?.name }</div>
                      </div>
                    </li>
                  </ul>
                )) || "Not Available"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Meta Information</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Created At</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="font-medium text-primary-600 hover:text-primary-500">
                        { pageData?.created_at ? pageData?.created_at : null }
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Updated At</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="font-medium text-primary-600 hover:text-primary-500">
                        { pageData?.updated_at ? pageData?.updated_at : null }
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Last Modified By</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                        { pageData?.last_updated_by || "Not Available"  }
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
};

export default BatchDetailPage;