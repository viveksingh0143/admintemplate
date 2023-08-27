import { Button, Dropdown } from "@components/ui";
import PageHeader from "@components/ui/pageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicTable from "@components/ui/basicTable";
import { ContainerTypes, containerColumns } from "./containersDef";
import { classNames } from "@lib/utils";
import { useContainerList } from "@hooks/warehouse/containers/containersHooks";

const ContainerListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filter, setFilter] = useState({ type: Object.values(ContainerTypes)[0] });
  const { data: pageData, isLoading, error } = useContainerList(page, pageSize, "", filter);

  const onPageChange = (page: number | undefined, pageSize: number | undefined) => {
    if (pageSize) setPageSize(pageSize);
    if (!page) setPage(1);
    else if (page < 1) setPage(1); // Ensure that the page does not go below 1
    else if (page > pageData.total_pages) setPage(pageData.total_pages); // Ensure that the page does not go above the total pages
    else setPage(page);
  };

  const loadContainerType = (containerType: string) => {
    setFilter({
      ...filter,
      type: containerType
    })
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Containers" }]}
        actions={[{ label: "Create", variant:"secondary", onClick: () => navigate("/secure/warehouse/containers/create") }]}
      >
        <div>
          <div className="sm:hidden">
            <Dropdown variant="secondary" options={Object.values(ContainerTypes)} onChange={section => loadContainerType(section)} buttonClassName="text-secondary" value={Object.values(ContainerTypes)[0]} showSelectedItem={true} />
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {
                Object.values(ContainerTypes).map(t => (
                  <a key={t}
                    href="#"
                    onClick={() => loadContainerType(t)}
                    className={classNames(t === filter.type ? 'bg-primary-200 text-gray-900 hover:bg-primary hover:text-white' : 'text-white hover:bg-primary', 'rounded-md px-3 py-2 text-sm font-medium')}
                  >{t}</a>
                ))
              }
            </nav>
          </div>
        </div>
      </PageHeader>
      <div className="p-4 shadow-xl rounded-lg">
        <BasicTable
          data={pageData?.data}
          columns={containerColumns}
          isFetching={isLoading}
          skeletonCount={5}
          rowsPerPage={pageSize}
          pageCount={pageData?.total_pages}
          onPageChange={onPageChange}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default ContainerListPage;