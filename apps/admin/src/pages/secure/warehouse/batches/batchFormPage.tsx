import EasyForm, { useEasyForm, Input, Select, Textarea, DateInput } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useBatchDetail, useBatchFormServiceHook } from '@hooks/warehouse/batches/batchesHooks';
import { useWatch } from 'react-hook-form';
import { useCustomerList } from '@hooks/customers/customersHooks';
import { useProductList } from '@hooks/products/productsHooks';
import { useMachineList } from '@hooks/machines/machinesHooks';

const batchSchema = z.object({
  batch_date: z.coerce.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }),
  batch_no: z.string().nonempty("Batch number is required"),
  so_number: z.string(),
  target_quantity: z.number().min(1),
  po_category: z.string().nonempty("PO Category is required"),
  customer_id: z.string().nonempty("Customer is required"),
  product_id: z.string().nonempty("Product is required"),
  machine_id: z.string().nonempty("Machine is required"),
  unit_weight: z.number().min(0),
  unit_type: z.string().nonempty("Unit is required"),
  package_quantity: z.number().min(0),
  labels_to_print: z.number(),
  total_printed: z.number(),
});


const BatchFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: customers, isLoading: isCustomerLoading, error: customerError } = useCustomerList(1, 2000, "", {});
  const { data: products, isLoading: isProductLoading, error: productError } = useProductList(1, 2000, "", { type: "Finished Goods" });
  const { data: machines, isLoading: isMachineLoading, error: machineError } = useMachineList(1, 2000, "", {});
  const { data: formData, isLoading: isDataLoading, error } = useBatchDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(batchSchema);
  const { reset: resetForm, setValue, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Batch updated successfully', 'success');
    else setShowNotification('Batch created successfully', 'success');

    if (isEditMode) { navigate(`/secure/warehouse/batches/${id}`) } else { navigate('/secure/warehouse/batches') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, name, address, status } = errors;
    // setError("name", name?.message);
    // setError("location", address?.location);
    // setError("status", status?.message);
    if (rootError?.message && notificationRef.current) {
      notificationRef.current.showNotification(rootError?.message, "danger");
    }
  };

  const mutation = useBatchFormServiceHook(isEditMode, id, successFn, errorsFn);
  
  const handleSubmit = async (data: z.infer<typeof batchSchema>) => {
    mutation.mutate({ batch_date: data.batch_date, batch_no: data.batch_no, so_number: data.so_number, target_quantity: data.target_quantity, po_category: data.po_category, customer_id: data.customer_id, product_id: data.product_id, machine_id: data.machine_id, unit_weight: data.unit_weight, unit_type: data.unit_type, package_quantity: data.package_quantity });
  };

  const resetFormHandler = () => {
    const defaultValues = {
      batch_date: null,
      batch_no: "",
      so_number: "",
      target_quantity: 1,
      po_category: CommonConstant.PO_CATEGORIES[0].value,
      customer_id: null,
      product_id: null,
      machine_id: null,
      unit_weight: 0,
      unit_type: CommonConstant.UNIT_TYPES[0].value,
      package_quantity: 0,
      labels_to_print: 0,
      total_printed: 0,
    };
    if (isEditMode && formData) {
      resetForm({...defaultValues, ...formData});
    } else {
      resetForm(defaultValues);
    }
  };

  useEffect(() => {
    resetFormHandler();
  }, [isEditMode, formData, resetForm]);

  const target_quantity = useWatch({ control: methods.control, name: "target_quantity" });
  const package_quantity = useWatch({ control: methods.control, name: "package_quantity" });

  useEffect(() => {
    if (package_quantity === undefined || package_quantity <= 0) {
      setValue("labels_to_print", 0);
    } else {
      setValue("labels_to_print", Math.ceil(target_quantity / package_quantity));
    }
  }, [target_quantity, package_quantity]);
  

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Batch (Packaging Label)`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Batchs (Packaging Label)" }, { label: `${isEditMode ? "Update" : "Create"} Batch (Packaging Label)` }]}
        actions={[
          { label: "List Batches", variant: "secondary", onClick: () => navigate("/secure/warehouse/batches") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <DateInput name="batch_date" label="Batch Date" onChange={() => {}} className='sm:col-span-6' />
              <Input name="batch_no" label="Batch Number" placeholder="Please enter batch number" className='sm:col-span-6' />
              
              <Input name="so_number" label="SO Number" placeholder="Please enter SO number" className='sm:col-span-6' />
              <Input type='number' name="target_quantity" label="Target Quantity" placeholder="Please enter target quantity" className='sm:col-span-6' />

              <Select name="customer_id" label="Customer Name" placeholder="Please select customer" options={customers?.data} labelKey='name' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Select name="po_category" label="PO Category" placeholder="Please enter PO category" options={CommonConstant.PO_CATEGORIES} className='sm:col-span-6' />
              
              <Select name="product_id" label="Product Code" placeholder="Please enter Product Code" options={products?.data} labelKey='code' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Input name="product_name" label="Product Name" placeholder="Please enter product name" className='sm:col-span-6' disabled={true} />

              <Select name="machine_id" label="Machine Code" placeholder="Please enter machine" options={machines?.data} labelKey='code' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Input name="machine_name" label="Machine Name" placeholder="Please enter machine name" className='sm:col-span-6' disabled={true} />

              <Input type='number' name="unit_weight" label="Unit Weight" placeholder="Please enter unit weight" className='sm:col-span-6' />
              <Select name="unit_type" label="Unit Type" placeholder="Please select unit type" options={CommonConstant.UNIT_TYPES} className='sm:col-span-6' />

              <Input type='number' name="package_quantity" label="Package Quantity" placeholder="Please enter package quantity" className='sm:col-span-6' />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Input type='number' name="labels_to_print" label="Labels To Be Printed" className='sm:col-span-6' disabled={true} />
              <Input type='number' name="total_printed" label="Total Labels Printed" className='sm:col-span-6' disabled={true} />
            </div>

          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Batch`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default BatchFormPage;
