import { SidebarProvider, SidebarInset } from '@/shared/web/components/ui';
import { Outlet } from 'react-router';
import { AppSidebar } from './_components/sidebar';

export const ProtectedLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
