import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';
import { useWatch } from 'react-hook-form';

const containerSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  address: z.string(),
  container_type: z.string().nonempty("Container type is required"),
  status: z.string(),
});

const ContainerFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: containerInfoData, isLoading: isContainerInfoDataLoading, error: containerInfoDataError } = isEditMode ? {data: null, isLoading: false, error: null} : useAxiosQuery(`${API_URLS.MASTER.CONTAINER_API}/container-code-info`);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.MASTER.CONTAINER_API}/${id}`) : {data: null, isLoading: false, error: null};
  
  const methods = useEasyForm(containerSchema);
  const { reset: resetForm, setValue, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const containerType = useWatch({ control: methods.control, name: "container_type" });
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.MASTER.CONTAINER_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.CONTAINER_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Container updated successfully', 'success');
      else setShowNotification('Container created successfully', 'success');
      if (isEditMode) { navigate(`/secure/master/containers/${id}`) } else { navigate('/secure/master/containers') };
    },
    (errors) => {
      const { rootError, code, name, address, container_type, status } = errors;
      setError("code", { type: "manual", message: code?.message });
      setError("name", { type: "manual", message: name?.message });
      setError("address", { type: "manual", message: address?.message });
      setError("status", { type: "manual", message: status?.message });
      setError("container_type", { type: "manual", message: container_type?.message });

      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof containerSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      code: "",
      name: "",
      status: "ENABLE",
      address: "",
      container_type: "PALLET"
    };
    if (isEditMode && formData) {
      resetForm({ ...defaultValues, ...formData });
    } else {
      resetForm(defaultValues);
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [formData, containerInfoData, isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      const containerInfo = containerInfoData?.find((c: any) => c.container_type === containerType);
      if (containerInfo) {
        let codeStr = containerInfo?.code;
        let i = 0;
        while (i < codeStr.length && isNaN(parseInt(codeStr[i], 10))) {
          i++;
        }
        const prefix = codeStr.substring(0, i);
        const numericPart = codeStr.substring(i);
        const incrementedNumericPart = numericPart ? (parseInt(numericPart, 10) + 1).toString().padStart(numericPart.length, '0') : "00001";
        setValue("code", `${prefix}${incrementedNumericPart}`);
      }
    }
  }, [containerInfoData, containerType, setValue, isEditMode]);

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Container`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Containers" }, { label: `${isEditMode ? "Update" : "Create"} Container` }]}
        actions={[
          { label: "List Containers", variant: "secondary", onClick: () => navigate("/secure/master/containers") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting || isContainerInfoDataLoading || isDataLoading} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Select name="container_type" label="Container Type" placeholder="Please enter container type" options={CommonConstant.COMMON_CONTAINER_TYPES} className='sm:col-span-4' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-4' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-4' />
              {containerType === "RACK" && (
                <Textarea name="address" label="Address" placeholder="Please enter address" className='sm:col-span-12' />
              )}
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-4' />
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
