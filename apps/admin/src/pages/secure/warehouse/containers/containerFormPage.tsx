import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useContainerDetail, useContainerFormServiceHook } from '@hooks/warehouse/containers/containersHooks';
import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ContainerTypes } from './containersDef';
import { CommonConstant } from '@configs/constants/common';

const containerSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  address: z.string(),
  type: z.string().nonempty("Type is required"),
  status: z.string(),
});


const ContainerFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: formData, isLoading: isDataLoading, error } = useContainerDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(containerSchema);
  const containerType = useWatch({ control: methods.control, name: "type" });
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Container updated successfully', 'success');
    else setShowNotification('Container created successfully', 'success');

    if (isEditMode) { navigate(`/secure/warehouse/containers/${id}`) } else { navigate('/secure/warehouse/containers') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, code, name, address, type, status } = errors;
    setError("code", code?.message);
    setError("name", name?.message);
    setError("address", address?.message);
    setError("type", type?.message);
    setError("status", status?.message);
    if (rootError?.message && notificationRef.current) {
      notificationRef.current.showNotification(rootError?.message, "danger");
    }
  };

  const mutation = useContainerFormServiceHook(isEditMode, id, successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof containerSchema>) => {
    mutation.mutate({ code: data.code, name: data.name, address: data.address, type: data.type, status: data?.status });
  };

  const resetFormHandler = () => {
    if (isEditMode && formData) {
      resetForm(formData);
    } else {
      resetForm({
        code: "",
        name: "",
        address: "",
        type: "BIN",
        status: "active",
      });
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [isEditMode, formData, resetForm]);

  console.log("Form Render");

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Container`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Containers" }, { label: `${isEditMode ? "Update" : "Create"} Container` }]}
        actions={[
          { label: "List Containers", variant: "secondary", onClick: () => navigate("/secure/warehouse/containers") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-10">
              <Select name="type" label="Type" placeholder="Please enter type" options={Object.values(ContainerTypes)} className='sm:col-span-2' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-2' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              {containerType === ContainerTypes.RACK && (
                <Textarea name="address" label="Address" placeholder="Please enter address" className='sm:col-span-10' />
              )}
              { isEditMode && (<Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-2' />)}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Container`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default ContainerFormPage;
