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
import { useMachineDetail, useMachineFormServiceHook } from '@hooks/machines/machinesHooks';

const machineSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  status: z.string(),
});


const MachineFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: formData, isLoading: isDataLoading, error } = useMachineDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(machineSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Machine updated successfully', 'success');
    else setShowNotification('Machine created successfully', 'success');

    if (isEditMode) { navigate(`/secure/machines/${id}`) } else { navigate('/secure/machines') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, name, code, status } = errors;
    setError("code", code?.message);
    setError("name", name?.message);
    setError("status", status?.message);
    if (rootError?.message && notificationRef.current) {
      notificationRef.current.showNotification(rootError?.message, "danger");
    }
  };

  const mutation = useMachineFormServiceHook(isEditMode, id, successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof machineSchema>) => {
    mutation.mutate({ code: data.code, name: data.name, status: data?.status });
  };

  const resetFormHandler = () => {
    const defaultValues = {
      code: "",
      name: "",
      status: "active",
    };
    if (isEditMode && formData) {
      const { code, name, status } = formData;
      resetForm({...defaultValues, name, code, status});
    } else {
      resetForm(defaultValues);
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [isEditMode, formData, resetForm]);

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Machine`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Machines" }, { label: `${isEditMode ? "Update" : "Create"} Machine` }]}
        actions={[
          { label: "List Machines", variant: "secondary", onClick: () => navigate("/secure/machines") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
            <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-4' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-4' />
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-4' />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Machine`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default MachineFormPage;
