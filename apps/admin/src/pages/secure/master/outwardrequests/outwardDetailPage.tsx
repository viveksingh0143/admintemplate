import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { BoltIcon, ClockIcon } from "@heroicons/react/20/solid";
import { Button, Chip } from "@components/ui";
import { useAxiosMutation, useAxiosQuery } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import { useRef, useState } from "react";
import TabGroup, { TabType } from "@components/ui/tabs";
import { EyeIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useNotification } from "@hooks/notificationContext";
import { Notification, NotificationHandles } from "@components/ui/notification";
import AxiosService from "@services/axiosService";

const tabs: TabType[] = [{ name: "General Information" }, { name: "Shipper Labels" }]

const OutwardRequestDetailPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useAxiosQuery(`${API_URLS.MASTER.OUTWARD_REQUEST_API}/${id}`);
  const { data: shipperData, isLoading: isShipperLoading, error: shipperError } = useAxiosQuery(`${API_URLS.MASTER.OUTWARD_REQUEST_API}/${id}/shipperlabels`);

  const handleTabClick = (selectedTab: TabType) => {
    setCurrentTab(selectedTab);
  };

  const notificationRef = useRef<NotificationHandles>(null);
  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.OUTWARD_REQUEST_API}/${id}/shipperlabels`, data);
      return response?.data;
    },
    (data) => {
      setShowNotification('Shipper generated successfully', 'success');
    },
    (errors) => {
      const { rootError, code, name, location, status } = errors;
      if (rootError?.message && notificationRef.current) {
        // notificationRef.current.showNotification(rootError?.message, "danger");
        notificationRef.current.showNotification("server response 500", "danger");
      }
    }
  );

  const handleGenerate = async (data: { batch_no: string, product_id: number }) => {
    mutation.mutate(data);
  };

  const showShipperLabels = () => (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
      <div className="border-t border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        Batch No.
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Product Code
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Product Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Package Count
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Shipper Number
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Packed At
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Actions</span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  { isShipperLoading ? 
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td colSpan={8}>Shipper details loading</td>
                    </tr>
                  </tbody>
                  :
                  shipperData ?
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {shipperData?.map((shipper: any, index: number) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">{shipper.batch_no}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{shipper.product_code}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{shipper.product_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{shipper.package_count}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{shipper.shipper_number}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{shipper.shipper_packed_at}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          {
                            shipper.shipper_number
                            ? <>
                                {/* <Button variant="primary" label="Show" icon={<EyeIcon className="h-4 w-3 rounded-full inline-flex mr-1" />} onClick={() => navigate(`/secure/master/outwardrequests/${shipper.shipper_id}`)} />
                                <Button variant="primary" label="Print" icon={<PrinterIcon className="h-4 w-3 rounded-full inline-flex mr-1" />} onClick={() => navigate(`/secure/master/outwardrequests/${shipper.shipper_id}`)} /> */}
                              </>
                            : <Button variant="primary" label="Generate" icon={<BoltIcon className="h-3 w-3 rounded-full inline-flex mr-1" />} onClick={() => handleGenerate(shipper)} />
                          }
                        </td>
                        <td>
                          <Button variant="info" icon={<PrinterIcon className="h-4 w-3 rounded-full" />} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  : 
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td colSpan={8} className="text-center">No Shipper Details</td>
                    </tr>
                  </tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const showGeneralInfo = () => (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Order Number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.order_no}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Issued Date</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.issued_date}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Customer Information</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="sm:grid sm:grid-cols-10 sm:gap-4">
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Name</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.customer?.name}</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Code</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.customer?.code}</div>

                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2  font-semibold">Contact Person</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3">{pageData?.customer?.contact_person}</div>
              </div>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Order Items</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="border-b border-gray-900/10">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                          S.No.
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Product
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {pageData?.items?.map((item: any, index: number) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {item.product.name} #{item.product.code}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {item.product.name} #{item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Status</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <Chip className="text-xs py-1 px-2" label={pageData?.status?.toUpperCase()} variant={pageData?.status === "ENABLE" ? "success" : "warning"} />
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
                      {pageData?.created_at ? pageData?.created_at : null}
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
                      {pageData?.updated_at ? pageData?.updated_at : null}
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
                      {pageData?.last_updated_by || "Not Available"}
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        label={`Outward Request Detail - ${pageData?.order_no}`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Outward Requests" }]}
        actions={[
          { label: "Edit Outward Request", variant: "info", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/outwardrequests/" + id + "/edit") },
          { label: "List Outward Requests", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/master/outwardrequests") }
        ]}
        className="px-4"
      >
        <TabGroup tabs={tabs} currentTab={currentTab} onTabClick={handleTabClick} label="Select a tab" />
      </PageHeader>
      {currentTab.name === 'General Information' ? showGeneralInfo() : showShipperLabels()}
    </>
  )
};

export default OutwardRequestDetailPage;