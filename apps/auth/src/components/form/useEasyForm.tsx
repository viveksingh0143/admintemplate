import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

export default function useEasyForm<T extends zod.ZodSchema<any>>(schema: T, defaultValues?: zod.infer<T>) {
  return useForm<zod.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });
}