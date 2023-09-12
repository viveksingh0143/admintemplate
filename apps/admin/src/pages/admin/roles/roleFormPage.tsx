import EasyForm, { useEasyForm, Input, Select, Textarea, Checkbox } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';
import ErrorSummary from '@components/ui/errorSummary';

const permissionSchema = z.object({
  module_name: z.string(),
  read_perm: z.boolean(),
  create_perm: z.boolean(),
  update_perm: z.boolean(),
  delete_perm: z.boolean(),
  import_perm: z.boolean(),
  export_perm: z.boolean(),
});

const roleSchema = z.object({
  name: z.string().nonempty("Name is required"),
  status: z.string(),
  permissions: z.array(permissionSchema)
});

const permissionsGrid = [
  { module_name: "USERS", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "ROLES", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "PRODUCT", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "BATCH LABEL", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "STORE", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "RM STOCKIN", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "FD STOCKING", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "RM STOCK OUT", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true },
  { module_name: "FD STOCK OUT", read_perm: false, create_perm: true, update_perm: true, delete_perm: true, import_perm: true, export_perm: true }
];

const RoleFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.ROLE_API}/${id}`) : {data: null, isLoading: false, error: null};
  
  const methods = useEasyForm(roleSchema);
  const { reset: resetForm, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.ROLE_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.ROLE_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Role updated successfully', 'success');
      else setShowNotification('Role created successfully', 'success');
      if (isEditMode) { navigate(`/secure/admin/roles/${id}`) } else { navigate('/secure/admin/roles') };
    },
    (errors) => {
      const { rootError, name, status } = errors;
      setError("name", { type: "manual", message: name?.message });
      setError("status", { type: "manual", message: status?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof roleSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      name: "",
      status: "ENABLE",
      permissions: permissionsGrid
    };
    if (isEditMode && formData) {
      resetForm({ ...defaultValues, ...formData });
    } else {
      resetForm(defaultValues);
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [formData, isEditMode]);

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Role`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Roles" }, { label: `${isEditMode ? "Update" : "Create"} Role` }]}
        actions={[
          { label: "List Roles", variant: "secondary", onClick: () => navigate("/secure/admin/roles") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
            <Input name="name" label="Role Name" placeholder="Please enter name" className='sm:col-span-6' />
            <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-6' />
          </div>
          <div className="border-b border-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Permissions Manager</h2>
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
                  {permissionsGrid.map((permissionGrid, index) => (
                    <tr key={permissionGrid.module_name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <Input type='hidden' name={`permissions[${index}].module_name`} label="Module Name" placeholder="Please enter module name" className='sm:col-span-6' />
                        {permissionGrid.module_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].read_perm`} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].create_perm`} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].update_perm`} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].delete_perm`} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].import_perm`} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Checkbox name={`permissions[${index}].export_perm`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Role`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default RoleFormPage;
