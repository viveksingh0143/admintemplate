import EasyForm, { useEasyForm, Checkbox, Input } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import { useLogin } from '@hooks/auth/useLogin';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z }  from 'zod';

const loginSchema = z.object({
  email: z.string().nonempty("Email address is required").email("Please enter a valid email address"),
  password: z.string().nonempty("Please enter your password"),
  rememberMe: z.boolean()
});

const LoginPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const methods = useEasyForm(loginSchema);
  const { setError, formState: { isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);
  const mutation = useLogin(
    () => navigate('/'),
    (errors) => {
      const { rootError, email, password, rememberMe } = errors;
      setError("email", email?.message);
      setError("password", password?.message);
      setError("rememberMe", rememberMe?.message);
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    mutation.mutate({ username: data.email, password: data.password, rememberMe: data.rememberMe });
  };

  return (
    <div className="mx-auto w-full max-w-sm md:max-w-md md:w-96 lg:w-128 xl:w-256 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <div>
        <img className="h-24 w-auto mx-auto" src="/images/berry-global.png" alt="Berry Global" />
        {/* <img className="h-10 w-auto mx-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
        <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full">
        <div className="relative bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <LoadingOverlay isLoading={isLoading || isSubmitting} />
          <div>
            <Notification ref={notificationRef} type="danger" fixed={false} className='mb-4' />

            <EasyForm methods={methods} onSubmit={handleSubmit} className="space-y-6">
              <Input name="email" label="Email address" placeholder="Please enter your email address" />
              <Input type="password" name="password" label="Password" placeholder="Please enter your password" />
              <div className="flex items-center justify-between">
                <Checkbox name="rememberMe" label="Remember me" />
                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button type="submit" loading={isLoading || isSubmitting} loadingText="Authenticating..." variant="primary" label="Sign in" className="flex w-full justify-center" />
              </div>
            </EasyForm>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
