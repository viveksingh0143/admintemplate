import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useInventoryFormServiceHook } from '@hooks/inventories/inventoriesHooks';
import { useNotification } from '@hooks/notificationContext';
import { useProductList } from '@hooks/products/productsHooks';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const stockinSchema = z.object({
  product_id: z.string().nonempty("Pallet is required"),
  quantity: z.number().nonnegative("Quantity is required"),
  pallet: z.string().nonempty("Pallet is required"),
});

const StockinRawMaterialPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  
  const { data: products, isLoading: isProductLoading, error: productError } = useProductList(1, 2000, "", { type: "RAW Material" });
  const methods = useEasyForm(stockinSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    setShowNotification('Stock updated successfully', 'success');
    navigate('/secure/warehouse/inventories')
  };

  const errorsFn = (errors: any) => {
    setShowNotification('Stock updated and stickers sent to printer successfully', 'success');
    navigate('/secure/warehouse/inventories')
  };

  const mutation = useInventoryFormServiceHook(successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof stockinSchema>) => {
    mutation.mutate({ product_id: data.product_id, quantity: data.quantity, pallet: data.pallet });
  };

  const resetFormHandler = () => {
    resetForm({
      quantity: 1,
      pallet: "PAL" + Math.floor(Math.random() * 1000000),
    });
  };

  useEffect(() => {
    resetFormHandler();
  }, [products, resetForm]);

  return (
    <>
      <PageHeader label="Stock In - Raw Material"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }, { label: "Stock In - Raw Material" }]}
        actions={[
          { label: "Inventories", variant:"secondary", onClick: () => navigate("/secure/warehouse/inventories") }
        ]}
        className="px-4"
      />
      <div className="overflow-hidden bg-white shadow sm:rounded-lg m-6 px-4 py-4 sm:px-6 lg:px-8 ">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-10">
              <Select name="product_id" label="Product" placeholder="Please enter Product" options={products?.data} labelKey='name' valueKey='id' className='sm:col-span-6' selectClassName="rounded-lg" />
              <Input type='number' name="quantity" label="Quantity" placeholder="Please enter quantity" className='sm:col-span-2' />
              <Input name="pallet" label="Pallet Code" placeholder="Please enter pallet code" className='sm:col-span-2' />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText="Creating..." variant="primary" label="Stock In" className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default StockinRawMaterialPage;
