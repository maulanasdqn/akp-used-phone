import { Outlet } from 'react-router';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
