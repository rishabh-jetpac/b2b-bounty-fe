import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { clearAuthSession, useAuthStore } from '../../../store/authStore'
import { hasAdminAccess } from '../../auth/utils/authRoles'

export function ProfileScreen() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isAdmin = hasAdminAccess(user?.role)

  useAuthenticatedHeader({
    title: 'Profile',
  })

  function handleLogout() {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  function handleCreateSubadmin() {
    navigate('/create-subadmin')
  }

  return (
    <Stack
      sx={{
        minHeight: {
          xs: 'calc(100svh - 58px - 108px - env(safe-area-inset-bottom))',
          sm: 'calc(100svh - 62px - 108px - env(safe-area-inset-bottom))',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${colors.outlineVariant}`,
          px: 2.25,
          py: 2.5,
          background: `linear-gradient(135deg, ${colors.surfaceContainerLow} 0%, ${colors.surfaceContainerLowest} 100%)`,
          boxShadow: `0 18px 40px ${alpha(colors.primary, 0.08)}`,
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography sx={fieldLabelSx}>Email</Typography>
            <Typography sx={fieldValueSx}>{user?.email ?? ''}</Typography>
          </Box>

          <Divider sx={{ borderColor: colors.outlineVariant }} />

          <Box>
            <Typography sx={fieldLabelSx}>Organization</Typography>
            <Typography sx={fieldValueSx}>{user?.orgName ?? ''}</Typography>
          </Box>

          <Divider sx={{ borderColor: colors.outlineVariant }} />

          <Box>
            <Typography sx={fieldLabelSx}>Role</Typography>
            <Typography sx={fieldValueSx}>{formatRoleLabel(user?.role)}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ flex: 1 }} />

      <Stack spacing={1.5} sx={{ pt: 2.25 }}>
        {isAdmin ? (
          <Button
            fullWidth
            onClick={handleCreateSubadmin}
            startIcon={<PersonAddAlt1OutlinedIcon />}
            sx={{
              minHeight: 48,
              borderRadius: '14px',
              borderColor: colors.outlineVariant,
              color: colors.primaryContainer,
              '&:hover': {
                borderColor: colors.primaryContainer,
                backgroundColor: colors.surfaceContainerLow,
              },
            }}
            variant="outlined"
          >
            Create Subadmin User
          </Button>
        ) : null}

        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutRoundedIcon />}
          sx={{
            minHeight: 48,
            borderRadius: '14px',
            backgroundColor: colors.primaryContainer,
            color: colors.onPrimary,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
          variant="contained"
        >
          Log out
        </Button>
      </Stack>
    </Stack>
  )
}

function formatRoleLabel(role?: string) {
  if (!role) {
    return ''
  }

  return role
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ')
}

const fieldLabelSx = {
  color: colors.onSurfaceVariant,
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
} as const

const fieldValueSx = {
  color: colors.onSurface,
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
} as const
