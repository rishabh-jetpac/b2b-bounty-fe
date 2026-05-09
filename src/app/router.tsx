import { createBrowserRouter } from 'react-router'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import { GuestOnlyRoute, ProtectedRoute, RootRedirect } from './AuthGate'
import CreateAccountRoute from '../routes/CreateAccountRoute'
import HistoryRoute from '../routes/HistoryRoute'
import InventoryAssignmentRoute from '../routes/InventoryAssignmentRoute'
import LoginRoute from '../routes/LoginRoute'
import PacksRoute from '../routes/PacksRoute'
import WalletRoute from '../routes/WalletRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
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
            path: '/packs',
            element: <PacksRoute />,
          },
          {
            path: '/inventory',
            element: <HistoryRoute />,
          },
          {
            path: '/inventory/:orderId',
            element: <InventoryAssignmentRoute />,
          },
          {
            path: '/wallet',
            element: <WalletRoute />,
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
