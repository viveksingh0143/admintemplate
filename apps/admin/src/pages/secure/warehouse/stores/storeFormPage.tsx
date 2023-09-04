import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useStoreDetail, useStoreFormServiceHook } from '@hooks/warehouse/stores/storesHooks';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';

const storeSchema = z.object({
  name: z.string().nonempty("Name is required"),
  location: z.string(),
  status: z.string(),
  owner: z.object({
    id: z.number(),
    name: z.string()
  })
});


const StoreFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: formData, isLoading: isDataLoading, error } = useStoreDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(storeSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Store updated successfully', 'success');
    else setShowNotification('Store created successfully', 'success');

    if (isEditMode) { navigate(`/secure/warehouse/stores/${id}`) } else { navigate('/secure/warehouse/stores') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, name, address, status } = errors;
    setError("name", name?.message);
    setError("location", address?.location);
    setError("status", status?.message);
    if (rootError?.message && notificationRef.current) {
      notificationRef.current.showNotification(rootError?.message, "danger");
    }
  };

  const mutation = useStoreFormServiceHook(isEditMode, id, successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof storeSchema>) => {
    mutation.mutate({ name: data.name, location: data.location, status: data?.status, owner: data?.owner });
  };

  const resetFormHandler = () => {
    const defaultValues = {
      name: "",
      location: "",
      status: "active",
      owner: {
        id: 0,
        name: ""
      }
    };
    if (isEditMode && formData) {
      const { name, location, status } = formData;
      resetForm({...defaultValues, name, location, status});
    } else {
      resetForm(defaultValues);
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [isEditMode, formData, resetForm]);

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Store`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Stores" }, { label: `${isEditMode ? "Update" : "Create"} Store` }]}
        actions={[
          { label: "List Stores", variant: "secondary", onClick: () => navigate("/secure/warehouse/stores") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-9">
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              <Input name="location" label="Location" placeholder="Please enter location" className='sm:col-span-3' />
              { isEditMode && (<Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-3' />)}
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
