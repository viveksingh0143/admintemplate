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
import { useAxiosMutation, useAxiosQuery } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';

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
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.MASTER.MACHINE_API}/${id}`) : {data: null, isLoading: false, error: null};
  
  const methods = useEasyForm(machineSchema);
  const { reset: resetForm, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.MASTER.MACHINE_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.MACHINE_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Machine updated successfully', 'success');
      else setShowNotification('Machine created successfully', 'success');
      if (isEditMode) { navigate(`/secure/master/machines/${id}`) } else { navigate('/secure/master/machines') };
    },
    (errors) => {
      const { rootError, code, name, status } = errors;
      setError("code", { type: "manual", message: code?.message });
      setError("name", { type: "manual", message: name?.message });
      setError("status", { type: "manual", message: status?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof machineSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      code: "",
      name: "",
      status: "ENABLE"
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
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Machine`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Machines" }, { label: `${isEditMode ? "Update" : "Create"} Machine` }]}
        actions={[
          { label: "List Machines", variant: "secondary", onClick: () => navigate("/secure/master/machines") }
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
