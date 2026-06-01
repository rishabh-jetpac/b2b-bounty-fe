import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import {
  Box,
  ButtonBase,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { clearAuthSession, useAuthStore } from '../../../store/authStore'
import { hasAdminAccess } from '../../auth/utils/authRoles'

type ReadonlyRowItem = {
  icon: ReactNode
  label: string
  value: string
}

export function ProfileScreen() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isAdmin = hasAdminAccess(user?.role)
  const displayName = getProfileDisplayName(user)
  const detailItems: ReadonlyRowItem[] = [
    {
      icon: <ApartmentRoundedIcon />,
      label: 'Organization',
      value: user?.orgName?.trim() ?? '',
    },
    {
      icon: <CurrencyRupeeRoundedIcon />,
      label: 'Base Currency',
      value: user?.baseCurrency?.trim() ?? '',
    },
    {
      icon: <BadgeRoundedIcon />,
      label: 'Role',
      value: formatRoleLabel(user?.role),
    },
  ].filter((item) => item.value)

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
    <Stack spacing={2}>
      <ProfileHeroCard
        displayName={displayName}
        email={user?.email ?? ''}
        monogram={getProfileMonogram(displayName || user?.email)}
      />

      {detailItems.length > 0 ? (
        <Stack spacing={1}>
          <Typography sx={sectionHeadingSx}>Account Details</Typography>
          <Paper elevation={0} sx={groupedCardSx}>
            <Stack divider={<Divider sx={groupedDividerSx} />}>
              {detailItems.map((item) => (
                <ReadonlyRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Stack>
          </Paper>
        </Stack>
      ) : null}

      <Stack spacing={1}>
        <Typography sx={sectionHeadingSx}>Actions</Typography>
        <Paper elevation={0} sx={groupedCardSx}>
          <Stack divider={<Divider sx={groupedDividerSx} />}>
            {isAdmin ? (
              <ActionRow
                icon={<PersonAddAlt1OutlinedIcon />}
                label="Create Subadmin User"
                onClick={handleCreateSubadmin}
              />
            ) : null}
            <ActionRow
              destructive
              icon={<LogoutRoundedIcon />}
              label="Log out"
              onClick={handleLogout}
            />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  )
}

function ProfileHeroCard({
  displayName,
  email,
  monogram,
}: {
  displayName: string
  email: string
  monogram: string
}) {
  return (
    <Paper elevation={0} sx={heroCardSx}>
      <Stack
        direction="row"
        spacing={1.75}
        sx={{
          alignItems: 'center',
        }}
      >
        <Box sx={monogramBadgeSx}>
          <Typography sx={monogramTextSx}>{monogram}</Typography>
        </Box>

        <Stack spacing={0.45} sx={{ minWidth: 0 }}>
          {displayName ? (
            <Typography sx={heroNameSx}>{displayName}</Typography>
          ) : null}
          <Typography sx={heroEmailSx}>{email}</Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

function ReadonlyRow({ icon, label, value }: ReadonlyRowItem) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'center',
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
      }}
    >
      <Box sx={getRowIconSx(false)}>{icon}</Box>

      <Stack spacing={0.3} sx={{ minWidth: 0 }}>
        <Typography sx={fieldLabelSx}>{label}</Typography>
        <Typography sx={fieldValueSx}>{value}</Typography>
      </Stack>
    </Stack>
  )
}

function ActionRow({
  destructive = false,
  icon,
  label,
  onClick,
}: {
  destructive?: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        textAlign: 'left',
        px: { xs: 2, sm: 2.5 },
        py: 1.75,
        '&:hover': {
          backgroundColor: destructive
            ? alpha(colors.errorContainer, 0.24)
            : colors.surfaceContainerLow,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={getRowIconSx(destructive)}>{icon}</Box>
        <Typography
          sx={destructive ? destructiveActionTextSx : actionTextSx}
        >
          {label}
        </Typography>
        <Box sx={actionChevronSx}>
          <ChevronRightRoundedIcon />
        </Box>
      </Stack>
    </ButtonBase>
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

function getProfileDisplayName(user: {
  firstName?: string
  lastName?: string
  name?: string
} | null) {
  const name = user?.name?.trim()

  if (name) {
    return name
  }

  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
}

function getProfileMonogram(value?: string) {
  const letter = (value ?? '')
    .split(/[\s@._-]+/)
    .map((segment) => segment.replace(/[^a-z]/gi, ''))
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .find(Boolean)

  return letter || 'N'
}

function getRowIconSx(destructive: boolean) {
  return {
    width: 44,
    height: 44,
    borderRadius: 2,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    color: destructive ? colors.error : colors.primaryContainer,
    backgroundColor: destructive
      ? alpha(colors.errorContainer, 0.7)
      : alpha(colors.primaryFixed, 0.88),
    '& svg': {
      fontSize: 24,
    },
  } as const
}

const sectionHeadingSx = {
  color: colors.onSurfaceVariant,
  fontFamily: '"Lexend", sans-serif',
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
} as const

const groupedCardSx = {
  overflow: 'hidden',
  borderRadius: 2,
  border: `1px solid ${alpha(colors.outlineVariant, 0.92)}`,
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow: 'none',
} as const

const groupedDividerSx = {
  borderColor: alpha(colors.outlineVariant, 0.78),
} as const

const heroCardSx = {
  borderRadius: 2,
  border: `1px solid ${alpha(colors.outlineVariant, 0.92)}`,
  px: { xs: 2, sm: 2.5 },
  py: 2.25,
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow: 'none',
} as const

const monogramBadgeSx = {
  width: 72,
  height: 72,
  borderRadius: 2,
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryContainer} 52%, ${colors.primaryFixedDim} 100%)`,
  color: colors.onPrimary,
  boxShadow: `0 10px 18px ${alpha(colors.primary, 0.18)}`,
} as const

const monogramTextSx = {
  color: colors.onPrimary,
  fontFamily: '"Lexend", sans-serif',
  fontSize: '1.4rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
} as const

const heroNameSx = {
  color: colors.onSurface,
  fontFamily: '"Lexend", sans-serif',
  fontSize: { xs: '1.45rem', sm: '1.6rem' },
  fontWeight: 700,
  lineHeight: 1.15,
  overflowWrap: 'anywhere',
} as const

const heroEmailSx = {
  color: colors.onSurfaceVariant,
  fontSize: { xs: '0.96rem', sm: '1rem' },
  lineHeight: 1.35,
  overflowWrap: 'anywhere',
} as const

const fieldLabelSx = {
  color: colors.onSurfaceVariant,
  fontFamily: '"Lexend", sans-serif',
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'capitalize',
} as const

const fieldValueSx = {
  color: colors.onSurface,
  fontSize: { xs: '0.98rem', sm: '1rem' },
  fontWeight: 600,
  lineHeight: 1.3,
  overflowWrap: 'anywhere',
} as const

const actionTextSx = {
  color: colors.onSurface,
  fontSize: { xs: '0.98rem', sm: '1rem' },
  fontWeight: 600,
  lineHeight: 1.3,
  flex: 1,
  minWidth: 0,
} as const

const destructiveActionTextSx = {
  ...actionTextSx,
  color: colors.error,
} as const

const actionChevronSx = {
  ml: 'auto',
  color: alpha(colors.onSurfaceVariant, 0.72),
  display: 'grid',
  placeItems: 'center',
  '& svg': {
    fontSize: 22,
  },
} as const
