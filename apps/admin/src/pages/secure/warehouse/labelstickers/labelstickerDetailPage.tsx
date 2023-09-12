import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Chip } from "@components/ui";
import { API_URLS } from "@configs/constants/apiUrls";
import { useAxiosQuery } from "@hooks/common/useCommonAxiosActions";

const LabelStickerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useAxiosQuery(`${API_URLS.WAREHOUSE.LABEL_STICKER_API}/${id}`);

  return (
    <>
      <PageHeader
        label={`Batch Sticker Detail - ${pageData?.batch_no}`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stickers" }]}
        actions={[
          { label: "Stickers", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/warehouse/labelstickers") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Batch Number</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.batch_no }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">UUID</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.uuid }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Packet No.</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.packet_no }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Print Count</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.print_count }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Work Shift</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.shift }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Product Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.product_line }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Unit</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.unit_weight }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Quantity</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.quantity }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Machine No.</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.machine_no }</dd>
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

export default LabelStickerDetailPage;