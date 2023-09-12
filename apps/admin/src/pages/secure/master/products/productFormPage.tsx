import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { API_URLS } from '@configs/constants/apiUrls';
import { CommonConstant } from '@configs/constants/common';
import { BarsArrowUpIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useAxiosMutation, useAxiosQuery } from '@hooks/common/useCommonAxiosActions';
import { useNotification } from '@hooks/notificationContext';
import AxiosService from '@services/axiosService';
import { useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const productSchema = z.object({
  product_type: z.string().nonempty("product type is required"),
  code: z.string().nonempty("Code is required"),
  link_code: z.string(),
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  status: z.string().nonempty("Status is required"),
  unit_type: z.string().nonempty("Unit type is required"),
  unit_weight: z.number(),
  unit_weight_type: z.string().nonempty("Unit weight type is required"),
});

const ProductFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.MASTER.PRODUCT_API}/${id}`) : { data: null, isLoading: false, error: null };

  const methods = useEasyForm(productSchema);
  const { reset: resetForm, setValue, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const unitType = useWatch({ control: methods.control, name: "unit_type" });
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.MASTER.PRODUCT_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.PRODUCT_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Product updated successfully', 'success');
      else setShowNotification('Product created successfully', 'success');
      if (isEditMode) { navigate(`/secure/master/products/${id}`) } else { navigate('/secure/master/products') };
    },
    (errors) => {
      const { rootError, product_type, code, link_code, name, description, unit_type, unit_weight, unit_weight_type, status } = errors;
      setError("product_type", { type: "manual", message: product_type?.message });
      setError("code", { type: "manual", message: code?.message });
      setError("link_code", { type: "manual", message: link_code?.message });
      setError("name", { type: "manual", message: name?.message });
      setError("description", { type: "manual", message: description?.message });
      setError("unit_type", { type: "manual", message: unit_type?.message });
      setError("unit_weight", { type: "manual", message: unit_weight?.message });
      setError("unit_weight_type", { type: "manual", message: unit_weight_type?.message });
      setError("status", { type: "manual", message: status?.message });

      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      product_type: "RAW Material",
      code: "",
      link_code: "",
      name: "",
      description: "",
      unit_type: CommonConstant.COMMON_UNITS[0],
      unit_weight: 0,
      unit_weight_type: CommonConstant.COMMON_WEIGHT_UNITS[0],
      status: "ENABLE",
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
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Product`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }, { label: `${isEditMode ? "Update" : "Create"} Product` }]}
        actions={[
          { label: "List Products", variant: "secondary", onClick: () => navigate("/secure/master/products") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-3">
              <Select name="product_type" label="Product Type" placeholder="Please enter type" options={CommonConstant.COMMON_PRODUCT_TYPES} className='sm:col-span-1' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-1' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-1' />
              <Select name="unit_type" label="Unit Type" placeholder="Please enter unit type" options={CommonConstant.COMMON_UNITS} className='sm:col-span-1' />
              {unitType === "Piece" && (<div className='mb-4 sm:col-span-1'>
                <label htmlFor="unit_weight" className="block text-sm font-medium text-gray-500">
                  Unit Weight
                </label>
                <div className="flex rounded-md shadow-sm">
                  <Input inputClassName='rounded-none rounded-l-md' hideLabel type='number' step="any" name="unit_weight" label="Unit Weight (KG)" placeholder="Please enter unit weight in KG" className='relative flex flex-grow focus-within:z-10' />
                  <Select selectClassName='rounded-none rounded-r-md min-w-fit' hideLabel name="unit_weight_type" label="Unit Weight Type" placeholder="Please enter unit weight type" options={CommonConstant.COMMON_WEIGHT_UNITS} className='relative inline-flex -ml-px w-28' />
                </div>
              </div>)}
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-1' />
              <Textarea name="description" label="Description" placeholder="Please enter description" className='sm:col-span-3' />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Product`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default ProductFormPage;
