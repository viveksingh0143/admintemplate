import EasyForm, { useEasyForm, Input, Select, DateInput } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery, useAxiosQueryWithParams } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';
import { useWatch } from 'react-hook-form';
import { showZodErrors } from '@lib/utils';
import ErrorSummary from '@components/ui/errorSummary';
import { parse } from 'date-fns';

const batchlabelSchema = z.object({
  batch_date: z.coerce.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }),
  batch_no: z.string().nonempty("Batch number is required"),
  so_number: z.string(),
  target_quantity: z.number().min(1),
  po_category: z.string().nonempty("PO Category is required"),
  customer: z.object({
    id: z.union([z.number(), z.string().transform(Number)]),
    name: z.string()
  }),
  product: z.object({
    id: z.union([z.number(), z.string().transform(Number)]),
    name: z.string()
  }),
  machine: z.object({
    id: z.union([z.number(), z.string().transform(Number)]),
    name: z.string()
  }),
  unit_weight: z.number().min(0),
  unit_weight_type: z.string().nonempty("Unit is required"),
  package_quantity: z.number().min(0),
  status: z.string(),
  labels_to_print: z.number(),
  total_printed: z.number(),
});

const BatchFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}/${id}`) : {data: null, isLoading: false, error: null};
  const { data: customers, isLoading: isCustomersLoading, error: customerError } = useAxiosQueryWithParams(API_URLS.MASTER.CUSTOMER_API, 1, 2000, "name asc", {});
  const { data: products, isLoading: isProductsLoading, error: productError } = useAxiosQueryWithParams(API_URLS.MASTER.PRODUCT_API, 1, 2000, "name asc", {});
  const { data: machines, isLoading: isMachinesLoading, error: machineError } = useAxiosQueryWithParams(API_URLS.MASTER.MACHINE_API, 1, 2000, "name asc", {});
  
  const methods = useEasyForm(batchlabelSchema);
  const { reset: resetForm, setValue, setError, formState: { isLoading, isSubmitting, errors } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);
  
  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Batch label updated successfully', 'success');
      else setShowNotification('Batch label created successfully', 'success');
      if (isEditMode) { navigate(`/secure/warehouse/batchlabels/${id}`) } else { navigate('/secure/warehouse/batchlabels') };
    },
    (errors) => {
      const { rootError, code, name, location, status } = errors;
      // setError("code", { type: "manual", message: code?.message });
      // setError("name", { type: "manual", message: name?.message });
      // setError("location", { type: "manual", message: location?.message });
      // setError("status", { type: "manual", message: status?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof batchlabelSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    let defaultValues = {
      batch_date: new Date(),
      batch_no: "",
      so_number: "",
      target_quantity: 1,
      po_category: CommonConstant.PO_CATEGORIES[0].value,
      customer: {
        id: customers?.data?.[0]?.id,
        name: customers?.data?.[0]?.name,
      },
      product: {
        id: products?.data?.[0]?.id,
        name: products?.data?.[0]?.name,
      },
      machine: {
        id: machines?.data?.[0]?.id,
        name: machines?.data?.[0]?.name,
      },
      unit_weight: products?.data?.[0]?.unit_weight,
      unit_weight_type: (products?.data?.[0]?.unit_weight ? products?.data?.[0]?.unit_weight : CommonConstant.COMMON_WEIGHT_UNITS[0]),
      package_quantity: 0,
      labels_to_print: 0,
      total_printed: 0,
      status: "ENABLE",
    };
    if (isEditMode && formData) {
      const updatedFormData = {
        ...formData,
        batch_date: parse(formData.batch_date, CommonConstant.DATE_FORMAT_TEMPLATE, new Date()),
        labels_to_print: formData.target_quantity / formData.package_quantity
      };

      defaultValues = {
        ...defaultValues,
        ...updatedFormData
      };
    }
    resetForm(defaultValues);
  };

  useEffect(() => {
    resetFormHandler();
  }, [formData, isEditMode, customers, products, machines]);

  const target_quantity = useWatch({ control: methods.control, name: "target_quantity" });
  const package_quantity = useWatch({ control: methods.control, name: "package_quantity" });
  const customer_id = useWatch({ control: methods.control, name: "customer.id" });
  const product_id = useWatch({ control: methods.control, name: "product.id" });
  const machine_id = useWatch({ control: methods.control, name: "machine.id" });

  useEffect(() => {
    if (product_id && products) {
      const product = products.data.find((tempProduct: { id: number; }) => tempProduct.id == product_id);
      if (product) {
        setValue("product.name", product.name);
        setValue("unit_weight", product.unit_weight);
        setValue("unit_weight_type", product.unit_weight_type);
      }
    }
  }, [product_id]);

  useEffect(() => {
    if (customer_id && customers) {
      const customer = customers.data.find((tempCustomer: { id: number; }) => tempCustomer.id == customer_id);
      if (customer) {
        setValue("customer.name", customer.name);
      }
    }
  }, [customer_id]);

  useEffect(() => {
    if (machine_id && machines) {
      const machine = machines.data.find((tempMachine: { id: number; }) => tempMachine.id == machine_id);
      if (machine) {
        setValue("machine.name", machine.name);
      }
    }
  }, [machine_id]);

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
          { label: "List Batches", variant: "secondary", onClick: () => navigate("/secure/warehouse/batchlabels") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <ErrorSummary errors={errors} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <DateInput name="batch_date" label="Batch Date" onChange={() => {}} className='sm:col-span-6' />
              <Input name="batch_no" label="Batch Number" placeholder="Please enter batch number" className='sm:col-span-6' />
              
              <Input name="so_number" label="SO Number" placeholder="Please enter SO number" className='sm:col-span-6' />
              <Input type='number' name="target_quantity" label="Target Quantity" placeholder="Please enter target quantity" className='sm:col-span-6' />

              <Select name="customer.id" label="Customer Name" placeholder="Please select customer" options={customers?.data} labelKey='name' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Select name="po_category" label="PO Category" placeholder="Please enter PO category" options={CommonConstant.PO_CATEGORIES} className='sm:col-span-6' />
              
              <Select name="product.id" label="Product Code" placeholder="Please enter Product Code" options={products?.data} labelKey='code' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Input name="product.name" label="Product Name" placeholder="Please enter product name" className='sm:col-span-6' disabled={true} />

              <Select name="machine.id" label="Machine Code" placeholder="Please enter machine" options={machines?.data} labelKey='code' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Input name="machine.name" label="Machine Name" placeholder="Please enter machine name" className='sm:col-span-6' disabled={true} />

              <Input type='number' step="any" name="unit_weight" label="Unit Weight" placeholder="Please enter unit weight" className='sm:col-span-6' />
              <Select name="unit_weight_type" label="Unit Weight Type" placeholder="Please select unit weight type" options={CommonConstant.COMMON_WEIGHT_UNITS} className='sm:col-span-6' />

              <Input type='number' name="package_quantity" label="Package Quantity" placeholder="Please enter package quantity" className='sm:col-span-6' />
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-6' />

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
