import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useInventoryFinishedStockFormServiceHook, useInventoryFormServiceHook } from '@hooks/inventories/inventoriesHooks';
import { useNotification } from '@hooks/notificationContext';
import { useProductList } from '@hooks/products/productsHooks';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const stockinSchema = z.object({
  product_id: z.string().nonempty("Pallet is required"),
  batch: z.string().nonempty("Batch is required"),
  machine: z.string().nonempty("Machine is required"),
  quantity: z.string().nonempty("Quantity is required"),
  shift: z.string().nonempty("Shift is required"),
  supervisor: z.string().nonempty("Supervisor is required"),
});

const StockinFinishedGoodsPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();
  
  const { data: products, isLoading: isProductLoading, error: productError } = useProductList(1, 2000, "", { type: "RAW Material" });
  const methods = useEasyForm(stockinSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const successFn = () => {
    setShowNotification('Stock updated and stickers sent to printer successfully', 'success');
    navigate('/secure/warehouse/inventories')
  };

  const errorsFn = (errors: any) => {
    setShowNotification('Stock updated and stickers sent to printer successfully', 'success');
    navigate('/secure/warehouse/inventories')
    // const { rootError, code, name, description, unit, type } = errors;
    //   setError("product_id", code?.product_id);
    //   setError("batch", code?.batch);
    //   setError("machine", code?.machine);
    //   setError("quantity", code?.quantity);
    //   setError("shift", code?.shift);
    //   setError("supervisor", code?.supervisor);
    //   if (rootError?.message && notificationRef.current) {
    //     notificationRef.current.showNotification(rootError?.message, "danger");
    //   }
  };

  const mutation = useInventoryFinishedStockFormServiceHook(successFn, errorsFn);

  const handleSubmit = async (data: z.infer<typeof stockinSchema>) => {
    mutation.mutate({ product_id: data.product_id, batch: data.batch, machine: data.machine, quantity: data.quantity, shift: data.shift, supervisor: data.supervisor });
  };

  const resetFormHandler = () => {
    resetForm({
      batch: "",
      machine: "",
      quantity: "100",
      shift: "1",
      supervisor: "",
    });
  };

  useEffect(() => {
    resetFormHandler();
  }, [products, resetForm]);

  console.log("Form Render");

  return (
    <>
      <PageHeader label="Stock In - Finished Goods"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }, { label: "Stock In - Finished Goods" }]}
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
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-12">
              <Select name="product_id" label="Product" placeholder="Please enter Product" options={products?.data} labelKey='name' valueKey='id' className='sm:col-span-12' selectClassName="rounded-lg" />
              <Input type='batch' name="batch" label="Batch" placeholder="Please enter batch" className='sm:col-span-3' />
              <Input type='machine' name="machine" label="Machine" placeholder="Please enter machine" className='sm:col-span-3' />              
              <Select name="shift" label="Shift" placeholder="Please enter shift" options={["1","2","3"]} className='sm:col-span-3' selectClassName="rounded-lg" />
              <Input name="supervisor" label="Supervisor" placeholder="Please enter supervisor" className='sm:col-span-3' />
              <Input type='number' name="quantity" label="Quantity" placeholder="Please enter quantity" className='sm:col-span-3' />
              
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

export default StockinFinishedGoodsPage;
