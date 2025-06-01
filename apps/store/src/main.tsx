import { createRoot } from 'react-dom/client';
import { middleware } from './middleware';
import { StrictMode } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import {
  add404PageToRoutesChildren,
  addErrorElementToRoutes,
  convertPagesToRoute,
  TRPCProvider,
} from '@/shared/web/utils';
import { Toaster } from 'sonner';
import './global.css';

const files = import.meta.glob('./app/**/*(page|layout).tsx');
const errorFiles = import.meta.glob('./app/**/*error.tsx');
const notFoundFiles = import.meta.glob('./app/**/*404.tsx');
const loadingFiles = import.meta.glob('./app/**/*loading.tsx');

const routes = convertPagesToRoute(files, loadingFiles) as RouteObject;
addErrorElementToRoutes(errorFiles, routes);
add404PageToRoutesChildren(notFoundFiles, routes);

const router = createBrowserRouter([
  {
    ...routes,
    loader: middleware,
    shouldRevalidate: () => true,
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <TRPCProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          classNames: {
            success: 'toast-success',
            error: 'toast-error',
          },
        }}
      />
      <RouterProvider router={router} />
    </TRPCProvider>
  </StrictMode>
);
