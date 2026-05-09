import { createBrowserRouter, Navigate } from 'react-router'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import CreateAccountRoute from '../routes/CreateAccountRoute'
import HistoryRoute from '../routes/HistoryRoute'
import LoginRoute from '../routes/LoginRoute'
import PacksRoute from '../routes/PacksRoute'
import WalletRoute from '../routes/WalletRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/packs" />,
  },
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/create-account',
    element: <CreateAccountRoute />,
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/packs',
        element: <PacksRoute />,
      },
      {
        path: '/inventory',
        element: <HistoryRoute />,
      },
      {
        path: '/wallet',
        element: <WalletRoute />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/packs" />,
  },
])
