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
import { useCustomerDetail, useCustomerFormServiceHook } from '@hooks/customers/customersHooks';

const addressSchema = z.object({
  address1: z.string(),
  address2: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
});


const customerSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  contact_person: z.string().nonempty("Contact person is required"),
  status: z.string(),
  billing_address: addressSchema,
  shipping_address: addressSchema,
});

const CustomerFormPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: formData, isLoading: isDataLoading, error } = useCustomerDetail(id, { enabled: isEditMode });

  const methods = useEasyForm(customerSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    if (isEditMode) setShowNotification('Customer updated successfully', 'success');
    else setShowNotification('Customer created successfully', 'success');

    if (isEditMode) { navigate(`/secure/customers/${id}`) } else { navigate('/secure/customers') };
  };

  const errorsFn = (errors: any) => {
    const { rootError, name, code, contact_person, status, billing_address, shipping_address } = errors;
    setError("code", code?.message);
    setError("name", name?.message);
    setError("contact_person", contact_person?.message);
    setError("status", status?.message);
    setError("billing_address.address1", billing_address?.address1?.message);
    setError("billing_address.address2", billing_address?.address2?.message);
    setError("billing_address.state", billing_address?.state?.message);
    setError("billing_address.country", billing_address?.country?.message);
    setError("billing_address.pincode", billing_address?.pincode?.message);
    setError("shipping_address.address1", shipping_address?.address1?.message);
    setError("shipping_address.address2", shipping_address?.address2?.message);
    setError("shipping_address.state", shipping_address?.state?.message);
    setError("shipping_address.country", shipping_address?.country?.message);
    setError("shipping_address.pincode", shipping_address?.pincode?.message);
    if (rootError?.message && notificationRef.current) {
      notificationRef.current.showNotification(rootError?.message, "danger");
    }
  };

  const mutation = useCustomerFormServiceHook(isEditMode, id, successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof customerSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      code: "",
      name: "",
      status: "active",
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

  return (
    <>
      <PageHeader label={`${isEditMode ? "Update" : "Create"} Customer`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Customers" }, { label: `${isEditMode ? "Update" : "Create"} Customer` }]}
        actions={[
          { label: "List Customers", variant: "secondary", onClick: () => navigate("/secure/customers") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-6' />
              <Input name="name" label="Company Name" placeholder="Please enter name" className='sm:col-span-6' />
              <Input name="contact_person" label="Contact Person" placeholder="Please enter contact person" className='sm:col-span-6' />
              <Select name="status" label="Status" placeholder="Please enter status" options={CommonConstant.COMMON_STATUSES} className='sm:col-span-6' />
            </div>
          </div>
          <div className="border-b border-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Billing Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Input name="billing_address.address1" label="Address Line 1" placeholder="Please enter address line 1" className='sm:col-span-6' />
              <Input name="billing_address.address2" label="Address Line 2" placeholder="Please enter address line 2" className='sm:col-span-6' />
              <Input name="billing_address.state" label="State" placeholder="Please enter state" className='sm:col-span-6' />
              <Input name="billing_address.country" label="Country" placeholder="Please enter Country" className='sm:col-span-6' />
              <Input name="billing_address.pincode" label="Pincode" placeholder="Please enter Pincode" className='sm:col-span-6' />
            </div>
          </div>
          <div className="border-b border-gray-900/10">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Shipping Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Input name="shipping_address.address1" label="Address Line 1" placeholder="Please enter address line 1" className='sm:col-span-6' />
              <Input name="shipping_address.address2" label="Address Line 2" placeholder="Please enter address line 2" className='sm:col-span-6' />
              <Input name="shipping_address.state" label="State" placeholder="Please enter state" className='sm:col-span-6' />
              <Input name="shipping_address.country" label="Country" placeholder="Please enter Country" className='sm:col-span-6' />
              <Input name="shipping_address.pincode" label="Pincode" placeholder="Please enter Pincode" className='sm:col-span-6' />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText={`${isEditMode ? "Updating" : "Creating"}...`} variant="primary" label={`${isEditMode ? "Update" : "Create"} Customer`} className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default CustomerFormPage;
