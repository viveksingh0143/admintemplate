import { Outlet, Route, Routes } from "react-router-dom";
import LoginAsset from "@assets/images/illustrations/access_account.svg";
import RegisterAsset from "@assets/images/illustrations/sign_up.svg";
import { useThemeContext } from "@hooks/themeContext";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";

import { Dropdown } from "@components/ui";
import { ColorThemes } from "@configs/constants/themeConstant";
import { ColorTheme } from "@ctypes/contexts/themeContextTypes";

const AuthLayout: React.FC = () => {
  const { theme, setTheme } = useThemeContext();
  const allThemes = Object.keys(ColorThemes);

  const onThemeChange = (option: any) => {
    const newTheme = ColorThemes[option as keyof typeof ColorThemes];
    if (newTheme) {
      setTheme({
        colorTheme: option,
        hasColorBg: newTheme.bgColor
      });
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <Outlet />
        </div>
        <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-r from-secondary-500 to-primary-500">
          <Routes>
            <Route path="/login" element={
              <LoginAsset className="h-48 w-full object-cover md:h-full md:w-96 mx-auto" />
            } />
            <Route path="/register" element={
              <RegisterAsset className="h-48 w-full object-cover md:h-full md:w-96 mx-auto" />
            } />
            <Route path="*" element={
              <LoginAsset className="h-48 w-full object-cover md:h-full md:w-96 mx-auto" />
            } />
          </Routes>
          <div className='absolute bottom-5 right-5'>
            <Dropdown onChange={onThemeChange} options={allThemes} loading={false} loadingText="Loading all the themes" variant="none" buttonClassName="text-secondary" chevron={false} optionsGroupClassName="bottom-9" buttonIcon={<Cog6ToothIcon className="h-6 w-6 mr-1" />} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout;