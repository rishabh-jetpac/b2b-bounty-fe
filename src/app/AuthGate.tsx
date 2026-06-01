import type { ReactNode } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router'
import { colors } from '../colors'
import { hasAdminAccess } from '../features/auth/utils/authRoles'
import { useAuthStore } from '../store/authStore'

function AuthGateLoader() {
  return (
    <Stack
      sx={{
        minHeight: '100svh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <CircularProgress />
    </Stack>
  )
}

export function RootRedirect() {
  const hydrated = useAuthStore((state) => state.hydrated)

  if (!hydrated) {
    return <AuthGateLoader />
  }

  return <Navigate replace to="/packs" />
}

export function GuestOnlyRoute() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore(
    (state) => Boolean(state.accessToken && state.user),
  )

  if (!hydrated) {
    return <AuthGateLoader />
  }

  if (isAuthenticated) {
    return <Navigate replace to="/packs" />
  }

  return <Outlet />
}

export function ProtectedRoute() {
  const location = useLocation()
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore(
    (state) => Boolean(state.accessToken && state.user),
  )

  if (!hydrated) {
    return <AuthGateLoader />
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`

    return <Navigate replace state={{ from }} to="/login" />
  }

  return <Outlet />
}

type AdminOnlyRouteProps = {
  children?: ReactNode
}

export function AdminOnlyRoute({ children }: AdminOnlyRouteProps) {
  const location = useLocation()
  const hydrated = useAuthStore((state) => state.hydrated)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore(
    (state) => Boolean(state.accessToken && state.user),
  )

  if (!hydrated) {
    return <AuthGateLoader />
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`

    return <Navigate replace state={{ from }} to="/login" />
  }

  if (!hasAdminAccess(user?.role)) {
    return <Navigate replace to="/packs" />
  }

  return children ?? <Outlet />
}
