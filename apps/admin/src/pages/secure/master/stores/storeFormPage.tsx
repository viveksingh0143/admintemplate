import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery, useAxiosQueryWithParams } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';

const storeSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  location: z.string(),
  status: z.string(),
  store_types: z.array(z.string()),
  owner: z.object({
    id: z.union([z.number(), z.string().transform(Number)])
  })
});


const StoreFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.MASTER.STORE_API}/${id}`) : {data: null, isLoading: false, error: null};
  const { data: owners, isLoading: isOwnersLoading, error: ownerError } = useAxiosQueryWithParams(API_URLS.USER_API, 1, 2000, "name asc", {});
  
  const methods = useEasyForm(storeSchema);
  const { reset: resetForm, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.MASTER.STORE_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.STORE_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Store updated successfully', 'success');
      else setShowNotification('Store created successfully', 'success');
      if (isEditMode) { navigate(`/secure/master/stores/${id}`) } else { navigate('/secure/master/stores') };
    },
    (errors) => {
      const { rootError, code, name, location, status } = errors;
      setError("code", { type: "manual", message: code?.message });
      setError("name", { type: "manual", message: name?.message });
      setError("location", { type: "manual", message: location?.message });
      setError("status", { type: "manual", message: status?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof storeSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    let defaultValues = {
      name: "",
      status: "ENABLE",
      owner: owners?.data?.[0]
    };
    if (isEditMode && formData) {
      defaultValues = {
        ...defaultValues,
        ...formData
      }
    }
    resetForm(defaultValues);
  };

  useEffect(() => {
    resetFormHandler();
  }, [formData, isEditMode, owners]);

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Store`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stores" }, { label: `${isEditMode ? "Update" : "Create"} Store` }]}
        actions={[
          { label: "List Stores", variant: "secondary", onClick: () => navigate("/secure/master/stores") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-9">
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-3' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              <Input name="location" label="Location" placeholder="Please enter location" className='sm:col-span-3' />
              <Select multiple name="store_types" label="Store Types" placeholder="Please select types" options={CommonConstant.COMMON_PRODUCT_TYPES} className='sm:col-span-3' selectClassName="rounded-lg" />
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-3' />
              <Select name="owner.id" label="Store Owner" placeholder="Please select user" options={owners?.data} labelKey='name' valueKey='id' className='sm:col-span-3' selectClassName="rounded-lg" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Store`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default StoreFormPage;
