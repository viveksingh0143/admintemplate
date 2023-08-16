import { Outlet, Route, Routes } from "react-router-dom";
import LoginAsset from "@assets/images/illustrations/access_account.svg";
import RegisterAsset from "@assets/images/illustrations/sign_up.svg";

const AuthLayout: React.FC = () => {
  return (
    <>
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <Outlet />
        </div>
        <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-r from-cyan-500 to-blue-500">
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
        </div>
      </div>
    </>
  )
}

export default AuthLayout;