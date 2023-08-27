import EasyForm, { useEasyForm, Input, Select, Textarea } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import PageHeader from '@components/ui/pageHeader';
import { useContainerCreate } from '@hooks/warehouse/containers/containersHooks';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ContainerTypes } from './containersDef';

const containerSchema = z.object({
  code: z.string().nonempty("Code is required"),
  name: z.string().nonempty("Name is required"),
  address: z.string(),
  type: z.string().nonempty("Type is required"),
});

const ContainerCreatePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const methods = useEasyForm(containerSchema);
  const containerType = useWatch({ control: methods.control, name: "type" });
  const { setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);
  const mutation = useContainerCreate(
    () => {
      navigate('/warehouse/containers');
    },
    (errors) => {
      const { rootError, code, name, address, type } = errors;
      setError("code", code?.message);
      setError("name", name?.message);
      setError("address", address?.message);
      setError("type", type?.message);
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof containerSchema>) => {
    mutation.mutate({ code: data.code, name: data.name, address: data.address, type: data.type });
  };

  return (
    <>
      <PageHeader label="New Container"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Containers" }, { label: "Create New Container" }]}
        actions={[ { label: "List Containers", variant: "secondary", onClick: () => navigate("/secure/warehouse/containers") } ]}
      />
      <div className="px-4 py-4 sm:px-6 lg:px-8 bg-primary-50 shadow-md m-4">
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-10">
              <Select name="type" label="Type" placeholder="Please enter type" options={Object.values(ContainerTypes)} className='sm:col-span-2' selectClassName="rounded-lg" />
              <Input name="code" label="Code" placeholder="Please enter code" className='sm:col-span-2' />
              <Input name="name" label="Name" placeholder="Please enter name" className='sm:col-span-3' />
              { containerType === ContainerTypes.RACK && (
                <Textarea name="address" label="Description" placeholder="Please enter address" className='sm:col-span-10' />
              )}              
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" loading={isLoading || isSubmitting} loadingText="Creating..." variant="primary" label="Create Container" className="flex w-full justify-center" />
            <Button type="reset" variant="secondary" label="Reset" className="flex w-full justify-center" />
          </div>
        </EasyForm>
      </div>      
    </>
  );
}

export default ContainerCreatePage;
