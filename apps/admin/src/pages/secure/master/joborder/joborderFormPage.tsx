import EasyForm, { useEasyForm, Input, Select, DateInput } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import PageHeader from '@components/ui/pageHeader';
import { Notification, NotificationHandles } from '@components/ui/notification';
import { useNotification } from '@hooks/notificationContext';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery, useAxiosQueryWithParams } from '@hooks/common/useCommonAxiosActions';
import { API_URLS } from '@configs/constants/apiUrls';
import AxiosService from '@services/axiosService';
import { useFieldArray, useWatch } from 'react-hook-form';
import ErrorSummary from '@components/ui/errorSummary';
import { parse } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';

const joborderSchema = z.object({
  issued_date: z.coerce.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }),
  order_no: z.string().nonempty("Order number is required"),
  po_category: z.string().nonempty("PO Category is required"),
  customer: z.object({
    id: z.union([z.number(), z.string().transform(Number)])
  }),
  items: z.array(z.object({
    product: z.object({
      id: z.union([z.number(), z.string().transform(Number)])
    }),
    quantity: z.number()
  })),
});

const JobOrderFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { data: formData, isLoading: isDataLoading, error } = isEditMode ? useAxiosQuery(`${API_URLS.MASTER.JOB_ORDER_API}/${id}`) : {data: null, isLoading: false, error: null};
  const { data: customers, isLoading: isCustomersLoading, error: customerError } = useAxiosQueryWithParams(API_URLS.MASTER.CUSTOMER_API, 1, 2000, "name asc", {});
  const { data: products, isLoading: isProductsLoading, error: productError } = useAxiosQueryWithParams(API_URLS.MASTER.PRODUCT_API, 1, 2000, "name asc", { product_type: CommonConstant.PRODUCT.FINISHED_GOODS });
  
  const methods = useEasyForm(joborderSchema);
  const { reset: resetForm, setValue, setError, formState: { isLoading, isSubmitting, errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "items"
  });

  const notificationRef = useRef<NotificationHandles>(null);
  
  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = null
      if (isEditMode) {
        response = await AxiosService.getInstance().axiosInstance.put(`${API_URLS.MASTER.JOB_ORDER_API}/${id}`, data);
      } else {
        response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.MASTER.JOB_ORDER_API}`, data);
      }
      return response?.data;
    },
    (data) => {
      if (isEditMode) setShowNotification('Job order updated successfully', 'success');
      else setShowNotification('Job order created successfully', 'success');
      if (isEditMode) { navigate(`/secure/master/joborders/${id}`) } else { navigate('/secure/master/joborders') };
    },
    (errors) => {
      const { rootError, code, name, location, status } = errors;
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof joborderSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    let defaultValues = {
      issued_date: new Date(),
      order_no: "",
      po_category: CommonConstant.PO_CATEGORIES[0].value,
      customer: {
        id: customers?.data?.[0]?.id
      },
      items: [
        {
          product: {
            id: products?.data?.[0]?.id
          },
          quantity: 1
        }
      ]
    };
    if (isEditMode && formData) {
      const updatedFormData = {
        ...formData,
        issued_date: parse(formData.issued_date, CommonConstant.DATE_FORMAT_TEMPLATE, new Date()),
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
  }, [formData, isEditMode, customers, products]);

  // const items = useWatch({ control: methods.control, name: "items" });
  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Job Order`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Job Order" }, { label: `${isEditMode ? "Update" : "Create"} Job Order` }]}
        actions={[
          { label: "List Job Orders", variant: "secondary", onClick: () => navigate("/secure/master/joborders") }
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
              <DateInput name="issued_date" label="Issued Date" onChange={() => {}} className='sm:col-span-6' />
              <Input name="order_no" label="Order Number" placeholder="Please enter order number" className='sm:col-span-6' />
              
              <Select name="customer.id" label="Customer Name" placeholder="Please select customer" options={customers?.data} labelKey='name' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Select name="po_category" label="PO Category" placeholder="Please enter PO category" options={CommonConstant.PO_CATEGORIES} className='sm:col-span-6' />
              <div className="border-t border-gray-900/10 sm:col-span-12">
                <div className="p-3  bg-gray-300 flex">
                  <span className='flex-grow text-base font-semibold leading-7 text-grey-800'>Order Items</span>
                  <Button type="button" variant="secondary" label="Add Item" onClick={() => append({ product: { id: products?.data?.[0]?.id, name: products?.data?.[0]?.name }, quantity: 1 })} />
                </div>
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 sm:col-span-12">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">S.No.</th>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Product Code</th>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Quantity</th>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {fields.map((item, index) => {
                      return (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{index + 1}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Select name={`items[${index}].product.id`} label="Product Code" placeholder="Please enter Product Code" options={products?.data} labelKey='code' valueKey='id' selectClassName="rounded-lg" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Input type='number' className='w-32' name={`items[${index}].quantity`} label="Product Quantity" placeholder="Please enter product name" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Button variant="danger" icon={<TrashIcon className="h-4 w-3 rounded-full" />} onClick={() => remove(index)} />
                        </td>
                      </tr>
                    )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Job Order`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default JobOrderFormPage;
