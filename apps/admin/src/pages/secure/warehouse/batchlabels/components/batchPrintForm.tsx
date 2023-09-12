import EasyForm, { useEasyForm, Input, Select, Textarea, DateInput } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import { FC, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useNotification } from '@hooks/notificationContext';
import { useThemeContext } from '@hooks/themeContext';
import { getCurrentWorkingShift } from '@lib/utils';
import { CommonConstant } from '@configs/constants/common';
import { useAxiosMutation } from '@hooks/common/useCommonAxiosActions';
import AxiosService from '@services/axiosService';
import { API_URLS } from '@configs/constants/apiUrls';

interface BatchPrintFormProps {
  batch: any;
  onClose: () => void;
}

const BatchPrintForm: FC<BatchPrintFormProps> = ({ batch, onClose }) => {
  const { sessionUser } = useThemeContext();
  const batchPrintSchema = z.object({
    sticker_numbers: z.number().min(1).max(batch.labels_to_print - batch.total_printed),
    shift: z.string(),
    last_updated_by: z.string().nonempty("Supervisor is required"),
  });

  const { setShowNotification } = useNotification();
  const methods = useEasyForm(batchPrintSchema);
  const { reset: resetForm, setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);

  const mutation = useAxiosMutation(
    async (data: any) => {
      const response = await AxiosService.getInstance().axiosInstance.post(`${API_URLS.WAREHOUSE.BATCH_LABEL_API}/${batch.id}/generate-stickers`, data);
      return response?.data;
    },
    (data) => {
      setShowNotification('Stickers sent to printer', 'success');
      onClose()
    },
    (errors) => {
      const { rootError, sticker_numbers, shift, last_updated_by } = errors;
      setError("sticker_numbers", { type: "manual", message: sticker_numbers?.message });
      setError("shift", { type: "manual", message: shift?.message });
      setError("last_updated_by", { type: "manual", message: last_updated_by?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof batchPrintSchema>) => {
    mutation.mutate(data);
  };

  const resetFormHandler = () => {
    const defaultValues = {
      sticker_numbers: 0,
      shift: "" + getCurrentWorkingShift(),
      last_updated_by: sessionUser?.name,
    };
    resetForm(defaultValues);
  };

  useEffect(() => {
    resetFormHandler();
  }, [])
  
  return (
    <>
      <div>
        <LoadingOverlay isLoading={isLoading || isSubmitting} />
        <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
          <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />
          <div className="border-b border-gray-900/10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2">
              <Input type='number' name="sticker_numbers" label="Labels Required" placeholder="Please enter labels count for Print" className='sm:col-span-1' />
              <Input readOnly={true} name="last_updated_by" label="Supervisor" className='sm:col-span-1' />
              <Select name="shift" label="Working Shift" placeholder="Please enter working shift" options={CommonConstant.WORK_SHIFTS} labelKey="time_interval" valueKey="number" className='sm:col-span-2' />
              
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="submit" variant="primary" label="Start Print" className="flex w-full justify-center" />
            <Button type="button" variant="secondary" label="Reset" className="flex w-full justify-center" onClick={resetFormHandler} />
          </div>
        </EasyForm>
      </div>
    </>
  );
}

export default BatchPrintForm;
