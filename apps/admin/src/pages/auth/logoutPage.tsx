import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '@components/ui/loadingOverlay';
import { useThemeContext } from '@hooks/themeContext';
import AxiosService from '@services/axiosService';

const LogoutPage: React.FunctionComponent = () => {
  const { setSessionUser } = useThemeContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        AxiosService.getInstance().clearAccessToken();
        setSessionUser({ name: "", staff_id: "", permissions: [] });
        navigate('/auth/login');
      } catch (error) {
        console.error('An error occurred while logging out:', error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [setSessionUser, navigate]);

  return (
    <div className="mx-auto w-full max-w-sm md:max-w-md md:w-96 lg:w-128 xl:w-256 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <LoadingOverlay loaderText="Signing you out, one moment please..." isLoading={true} />
    </div>
  );
};

export default LogoutPage;
