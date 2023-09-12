import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Chip } from "@components/ui";
import { useAxiosQuery } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";

const CustomerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useAxiosQuery(`${API_URLS.MASTER.CUSTOMER_API}/${id}`);

  return (
    <>
      <PageHeader
        label={`Customer Detail - ${pageData?.name}`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Customers" }]}
        actions={[
          { label: "Edit Customer", variant: "info", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/customers/" + id + "/edit") },
          { label: "List Customers", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/customers") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.name }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Code</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.code }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Contact Person</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ pageData?.contact_person }</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Status</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Chip className="text-xs py-1 px-2" label={pageData?.status?.toUpperCase()} variant={pageData?.status === "ENABLE" ? "success" : "warning"} />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Billing Address</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (pageData?.billing_address && (
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Address</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.billing_address?.address1 }<br />
                          { pageData?.billing_address?.address2 }<br />
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">State</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.billing_address?.state }
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Country</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.billing_address?.country }
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">PinCode</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.billing_address?.pincode }
                        </a>
                      </div>
                    </li>
                  </ul>
                )) || "Not Available"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium leading-6 text-gray-900">Shipping Address</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (pageData?.shipping_address && (
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Address</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.shipping_address?.address1 }<br />
                          { pageData?.shipping_address?.address2 }<br />
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">State</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.shipping_address?.state }
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">Country</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.shipping_address?.country }
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">PinCode</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          { pageData?.shipping_address?.pincode }
                        </a>
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

export default CustomerDetailPage;