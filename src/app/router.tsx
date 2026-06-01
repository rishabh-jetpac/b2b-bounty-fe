import { createBrowserRouter } from 'react-router'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import {
  AdminOnlyRoute,
  GuestOnlyRoute,
  ProtectedRoute,
  RootRedirect,
} from './AuthGate'
import CreateAccountRoute from '../routes/CreateAccountRoute'
import CreateSubadminRoute from '../routes/CreateSubadminRoute'
import CheckoutRoute from '../routes/CheckoutRoute'
import HistoryRoute from '../routes/HistoryRoute'
import InventoryAssignmentRoute from '../routes/InventoryAssignmentRoute'
import LoginRoute from '../routes/LoginRoute'
import PacksDestinationRoute from '../routes/PacksDestinationRoute'
import PacksRoute from '../routes/PacksRoute'
import ProfileRoute from '../routes/ProfileRoute'
import WalletRoute from '../routes/WalletRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/packs',
        element: <PacksRoute />,
      },
      {
        path: '/packs/:pageName',
        element: <PacksDestinationRoute />,
      },
    ],
  },
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginRoute />,
      },
      {
        path: '/create-account',
        element: <CreateAccountRoute />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: '/packs/:pageName/checkout',
            element: <CheckoutRoute />,
          },
          {
            path: '/inventory',
            element: <HistoryRoute />,
          },
          {
            path: '/inventory/assign/:packId',
            element: <InventoryAssignmentRoute />,
          },
          {
            path: '/wallet',
            element: <WalletRoute />,
          },
          {
            path: '/profile',
            element: <ProfileRoute />,
          },
          {
            path: '/create-subadmin',
            element: (
              <AdminOnlyRoute>
                <CreateSubadminRoute />
              </AdminOnlyRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])
