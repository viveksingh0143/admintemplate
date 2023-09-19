import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { API_URLS } from '@configs/constants/apiUrls';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation, useAxiosQuery, useAxiosQueryWithParams } from '@hooks/common/useCommonAxiosActions';
import { useNotification } from '@hooks/notificationContext';
import AxiosService from '@services/axiosService';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const stockinSchema = z.object({
  store_id: z.union([z.number(), z.string().transform(Number)]),
  product_id: z.union([z.number(), z.string().transform(Number)]),
  quantity: z.number().nonnegative("Quantity is required"),
  pallet: z.string().nonempty("Pallet is required"),
  create_pallet: z.boolean().default(true)
});

const StockinRawMaterialPage: React.FunctionComponent = () => {
  const { setShowNotification } = useNotification();
  const navigate = useNavigate();

  const { data: containerInfoData, isLoading: isContainerInfoDataLoading, error: containerInfoDataError } = useAxiosQuery(`${API_URLS.MASTER.CONTAINER_API}/container-code-info`);
  const { data: products, isLoading: isProductsLoading, error: productError } = useAxiosQueryWithParams(API_URLS.MASTER.PRODUCT_API, 1, 2000, "name asc", { product_type: CommonConstant.PRODUCT.RAW_MATERIAL }, isContainerInfoDataLoading);
  const { data: stores, isLoading: isStoreLoading, error: storeError } = useAxiosQueryWithParams(API_URLS.MASTER.STORE_API, 1, 2000, "name asc", { store_type: CommonConstant.PRODUCT.RAW_MATERIAL }, isContainerInfoDataLoading);
  
  const methods = useEasyForm(stockinSchema);
  const { reset: resetForm, setValue, setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      let response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.WAREHOUSE.INVENTORY_API}/raw-material`, data);
      return response?.data;
    },
    () => {
      setShowNotification('Stock updated successfully', 'success')
        .then(() => {
          setTimeout(() => {
            resetForm((data: any) => ({
              ...data,
              quantity: 0
            }))
          }, 900)
        })
    },
    (errors: { rootError: any; store_id: any; product_id: any; quantity: any; pallet: any; }) => {
      const { rootError, store_id, product_id, quantity, pallet } = errors;
      setError("store_id", { type: "manual", message: store_id?.message });
      setError("product_id", { type: "manual", message: product_id?.message });
      setError("quantity", { type: "manual", message: quantity?.message });
      setError("pallet", { type: "manual", message: pallet?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof stockinSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    resetForm({
      store_id: 0,
      product_id: 0,
      quantity: 0,
      pallet: "",
    });
  }

  useEffect(() =>{
    if (products?.data) {
      setValue("product_id", products?.data?.[0]?.id)
    }
    if (stores?.data) {
      setValue("store_id", stores?.data?.[0]?.id)
    }
  }, [products, stores])

  useEffect(() => {
      const containerInfo = containerInfoData?.find((c: any) => c.container_type === "PALLET");
      if (containerInfo) {
        let codeStr = containerInfo?.code;
        let i = 0;
        while (i < codeStr.length && isNaN(parseInt(codeStr[i], 10))) {
          i++;
        }
        const prefix = codeStr.substring(0, i);
        const numericPart = codeStr.substring(i);
        const incrementedNumericPart = numericPart ? (parseInt(numericPart, 10) + 1).toString().padStart(numericPart.length, '0') : "00001";
        setValue("pallet", `${prefix}${incrementedNumericPart}`);
      }
  }, [containerInfoData, setValue]);

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
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-4">
              <Select name="store_id" label="Store" placeholder="Please enter Store" options={stores?.data} labelKey='name' valueKey='id' className='sm:col-span-2' selectClassName="rounded-lg" />
              <Select name="product_id" label="Product" placeholder="Please enter Product" options={products?.data} labelKey='name' valueKey='id' className='sm:col-span-2' selectClassName="rounded-lg" />
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
