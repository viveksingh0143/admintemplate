import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useAxiosMutation, useAxiosQuery, useAxiosQueryWithParams } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';
import { CommonConstant } from '@configs/constants/common';

const userSchema = z.object({
  username: z.string(),
  staff_id: z.string().nonempty("Staff ID is required"),
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid format").nonempty("E-Mail is required"),
  password: z.string(),
  roles: z.array(z.string()),
});

const UserFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.USER_API}/${id}`) : {data: null, isLoading: false, error: null};
  const { data: roles, isLoading: isRolesLoading, error: roleError } = useAxiosQueryWithParams(API_URLS.ROLE_API, 1, 2000, "name asc", {});
  
  const methods = useEasyForm(userSchema);
  const { reset: resetForm, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      const postData = {
        ...data,
        roles: roles?.data.filter((role: any) => data.roles.includes(`${role.id}`))
      }

      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.USER_API}/${id}`, postData);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.USER_API}`, postData);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Role updated successfully', 'success');
      else setShowNotification('Role created successfully', 'success');
      if (isEditMode) { navigate(`/secure/admin/users/${id}`) } else { navigate('/secure/admin/users') };
    },
    (errors) => {
      const { rootError, name, username, staff_id, email, password, roles } = errors;
      setError("username", { type: "manual", message: username?.message });
      setError("staff_id", { type: "manual", message: staff_id?.message });
      setError("name", { type: "manual", message: name?.message });
      setError("email", { type: "manual", message: email?.message });
      setError("password", { type: "manual", message: password?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof userSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      name: "",
      status: "ENABLE",
    };
    if (isEditMode && formData) {
      formData.roles = formData?.roles?.map((p: any) => `${p.id}`)
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
      <PageHeader label={`${isEditMode ? "Update" : "Create"} User`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Users" }, { label: `${isEditMode ? "Update" : "Create"} User` }]}
        actions={[
          { label: "List Users", variant: "secondary", onClick: () => navigate("/secure/admin/users") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
            <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-6' />
            <Input name="staff_id" label="Staff ID" placeholder="Please enter staff ID" className='sm:col-span-6' />
            <Input name="email" label="E-Mail" placeholder="Please enter email" className='sm:col-span-6' />
            <Input name="username" label="Username" placeholder="Please enter username" className='sm:col-span-6' />
            <Input type='password' name="password" label="Password" placeholder="Please enter password" className='sm:col-span-6' />
            <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-6' />
            <Select multiple={true} name="roles" label="Roles" placeholder="Please select roles" options={roles?.data} labelKey='name' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} User`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default UserFormPage;
