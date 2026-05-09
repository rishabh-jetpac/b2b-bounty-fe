import { CircularProgress, Stack } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router'
import { colors } from '../colors'
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
  const isAuthenticated = useAuthStore(
    (state) => Boolean(state.accessToken && state.user),
  )

  if (!hydrated) {
    return <AuthGateLoader />
  }

  return <Navigate replace to={isAuthenticated ? '/packs' : '/login'} />
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
