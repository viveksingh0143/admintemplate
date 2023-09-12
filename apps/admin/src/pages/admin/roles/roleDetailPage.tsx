import PageHeader from "@components/ui/pageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Chip } from "@components/ui";
import { useAxiosQuery } from "@hooks/common/useCommonAxiosActions";
import { API_URLS } from "@configs/constants/apiUrls";
import { CheckIcon } from "@heroicons/react/24/outline";

const RoleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { data: pageData, isLoading, error } = useAxiosQuery(`${API_URLS.ROLE_API}/${id}`);

  return (
    <>
      <PageHeader
        label={`Role Detail - ${pageData?.name}`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Roles" }]}
        actions={[
          { label: "Edit Role", variant: "info", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/admin/roles/" + id + "/edit") },
          { label: "List Roles", variant: "primary", className: "text-xs px-3 py-0", onClick: () => navigate("/secure/admin/roles") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg my-6 mx-4">
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{pageData?.name}</dd>
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
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Permissions</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="border-b border-gray-900/10">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                            Module Name
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Read
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Create
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Update
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Delete
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Import
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Export
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {pageData?.permissions.map((perm: any, index: number) => (
                          <tr key={perm.module_name}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                              {perm.module_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.read_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.create_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.update_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.delete_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.import_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {perm.export_perm ? <CheckIcon className="h-4 w-4" /> : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
};

export default RoleDetailPage;