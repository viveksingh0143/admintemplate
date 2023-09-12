import EasyForm, { useEasyForm, Checkbox, Input } from '@components/form';
import Button from '@components/ui/button';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { Notification, NotificationHandles } from '@components/ui/notification';
import { useLogin } from '@hooks/auth/useLogin';
import { useAxiosMutation } from '@hooks/common/useCommonAxiosActions';
import { useThemeContext } from '@hooks/themeContext';
import { loginRequesst } from '@services/authService';
import AxiosService from '@services/axiosService';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().nonempty("Email address is required").email("Please enter a valid email address"),
  password: z.string().nonempty("Please enter your password"),
  remember_me: z.boolean()
});

const LoginPage: React.FunctionComponent = () => {
  const { setSessionUser } = useThemeContext();
  const navigate = useNavigate();
  const methods = useEasyForm(loginSchema);
  const { setError, formState: { errors, isLoading, isSubmitting } } = methods;
  const notificationRef = useRef<NotificationHandles>(null);
  const mutation = useAxiosMutation(
    loginRequesst,
    (data) => {
      const { access_token, refresh_token } = data.data;
      AxiosService.getInstance().updateAccessToken({ access_token, refresh_token });
      setSessionUser(data.data);
      navigate('/secure/master/products');
    },
    (errors) => {
      const { rootError, username, password, remember_me } = errors;
      setError("username", { type: "manual", message: username?.message });
      setError("password", { type: "manual", message: password?.message });
      setError("remember_me", { type: "manual", message: remember_me?.message });
      if (rootError?.message && notificationRef.current) {
        notificationRef.current.showNotification(rootError?.message, "danger");
      }
    }
  );

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    mutation.mutate({ username: data.username, password: data.password, remember_me: data.remember_me });
  };

  return (
    <div className="mx-auto w-full max-w-sm md:max-w-md md:w-96 lg:w-128 xl:w-256 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <div>
        <img className="h-24 w-auto mx-auto" src="/images/berry-global.png" alt="Berry Global" />
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
              <Input name="username" label="Email address" placeholder="Please enter your email address" />
              <Input type="password" name="password" label="Password" placeholder="Please enter your password" />
              <div className="flex items-center justify-between">
                <Checkbox name="remember_me" label="Remember me" />
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
