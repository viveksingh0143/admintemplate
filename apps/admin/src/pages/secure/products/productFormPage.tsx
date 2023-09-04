import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { CommonConstant } from '@configs/constants/common';
import { useNotification } from '@hooks/notificationContext';
import { useProductDetail, useProductFormServiceHook } from '@hooks/products/productsHooks';
import { useEffect, useRef } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const RAW_MATERIAL = "RAW Material";
const FINISHED_GOODS = "Finished Goods";

const productTypes: string[] = [RAW_MATERIAL, FINISHED_GOODS];

const rawMaterialSchema = z.object({
  code: z.string().nonempty("Code is required"),
  raw_code: z.string(),
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  unit: z.string().nonempty("Unit is required"),
  type: z.literal(RAW_MATERIAL),
  status: z.string().nonempty("Status is required"),
});

const finishedGoodsSchema = rawMaterialSchema.extend({
  type: z.literal(FINISHED_GOODS),
});

const productSchema = z.discriminatedUnion("type", [
  rawMaterialSchema,
  finishedGoodsSchema,
]);

const ProductFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const { data: formData, isLoading: isDataLoading, error } = useProductDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(productSchema);
  const productType = useWatch({ control: methods.control, name: "type" });
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Product updated successfully', 'success');
    else setShowNotification('Product created successfully', 'success');
    
    if (isEditMode) { navigate(`/secure/products/${id}`) } else { navigate('/secure/products') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, code, name, description, unit, type } = errors;
      setError("code", code?.message);
      setError("name", name?.message);
      setError("description", description?.message);
      setError("unit", unit?.message);
      setError("type", type?.message);
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
  };

  const mutation = useProductFormServiceHook(isEditMode, id, successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    if (data.type === RAW_MATERIAL) {
      mutation.mutate({ code: data.code, name: data.name, description: data.description, unit: data.unit, type: data.type, status: data.status });
    } else {
      mutation.mutate({ code: data.code, name: data.name, description: data.description, unit: data.unit, type: data.type, status: data.status, dependents: [] });
    }
  };

  const resetFormHandler = () => {
    if (isEditMode && formData) {
      resetForm(formData);
    } else {
      resetForm({
        code: "",
        raw_code: "",
        name: "",
        description: "",
        unit: "KG",
        type: RAW_MATERIAL,
        status: "active"
      });
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [isEditMode, formData, resetForm]);

  console.log("Form Render");

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Product`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }, { label: `${isEditMode ? "Update" : "Create"} Product` }]}
        actions={[
          { label: "List Products", variant:"secondary", onClick: () => navigate("/secure/products") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-10">
              <Select name="type" label="Type" placeholder="Please enter type" options={["RAW Material", "Finished Goods"]} className='sm:col-span-2' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-2' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              <Select name="unit" label="Unit" placeholder="Please enter unit" options={["KG", "PCS"]} className='sm:col-span-1' />
              <Textarea name="description" label="Description" placeholder="Please enter description" className='sm:col-span-10' />
              { isEditMode && (<Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-2' />)}
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
