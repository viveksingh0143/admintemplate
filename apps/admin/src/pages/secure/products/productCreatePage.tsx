import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useProductCreate } from '@hooks/products/productsHooks';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const productSchema = z.object({
  code: z.string().nonempty("Code is required"),
  raw_code: z.string(),
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  unit: z.string().nonempty("Unit is required"),
  type: z.string().nonempty("Type is required"),
  dependents: z.object({
    id: z.string(),
    quantity: z.number()
  }).array()
});

const ProductCreatePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const methods = useEasyForm(productSchema);
  const productType = useWatch({ control: methods.control, name: "type" });
  const { setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);
  const mutation = useProductCreate(
    () => {
      navigate('/');
    },
    (errors) => {
      const { rootError, code, name, description, unit, type } = errors;
      setError("code", code?.message);
      setError("name", name?.message);
      setError("description", description?.message);
      setError("unit", unit?.message);
      setError("type", type?.message);
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    mutation.mutate({ code: data.code, name: data.name, description: data.description, unit: data.unit, type: data.type, dependents: data.dependents });
  };

  return (
    <>
      <PageHeader label="New Product"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }, { label: "Create New Product" }]}
        actions={[
          { label: "List Products", variant:"secondary", onClick: () => navigate("/secure/products") }
        ]} />
      <div className="px-4 py-4 sm:px-6 lg:px-8 bg-primary-50 shadow-md m-4">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-10">
              <Select name="type" label="Type" placeholder="Please enter type" options={["RAW Material", "Finished Goods"]} className='sm:col-span-2' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-2' />
              <Input name="raw_code" label="Code (3rd Party Code)" placeholder="Please enter code" className='sm:col-span-2' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              <Select name="unit" label="Unit" placeholder="Please enter unit" options={["KG", "PCS"]} className='sm:col-span-1' />
              <Textarea name="description" label="Description" placeholder="Please enter description" className='sm:col-span-10' />
              { productType === "Finished Goods" && (
              <div className="p-4 sm:p-6 lg:p-8 sm:col-span-10 bg-primary-200">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Dependant Products</h1>
                    <p className="mt-2 text-sm text-gray-700">
                      A list of all the sub products, which help to finished this product
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Dependant
                    </button>
                  </div>
                </div>
                <div className="mt-8 flow-root">
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <table className='min-w-full divide-y divide-gray-300'>
                        <thead className='bg-primary-50'>
                          <tr>
                            <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>S.No.</th>
                            <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>Dependent Product Details</th>
                            <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>Quantity</th>
                            <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">1</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><Select hideLabel label='product' name='ddd' options={[]} /></td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><Input hideLabel name='qty' label='test' /></td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText="Creating..." variant="primary" label="Create Product" className="flex w-full justify-center" />
            <Button type="reset" variant="secondary" label="Reset" className="flex w-full justify-center" />
          </div>
        </EasyForm>
      </div>      
    </>
  );
}

export default ProductCreatePage;
