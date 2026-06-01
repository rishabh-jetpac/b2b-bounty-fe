import { yupResolver } from '@hookform/resolvers/yup'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded'
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { navigateBackOrTo } from '../../packs/utils/navigation'
import { AuthTextField } from '../components/AuthTextField'
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation'
import {
  changePasswordDefaultValues,
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../utils/authSchemas'

export function ChangePasswordScreen() {
  const navigate = useNavigate()
  const changePasswordMutation = useChangePasswordMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: changePasswordDefaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

  useAuthenticatedHeader({
    contentPaddingBottom: '0px',
    hideBottomNavigation: true,
    leadingAction: {
      ariaLabel: 'Back to profile',
      icon: 'back',
      onClick: () => navigateBackOrTo(navigate, '/profile'),
    },
    title: 'Reset Password',
  })

  const onSubmit = async (values: ChangePasswordFormValues) => {
    changePasswordMutation.reset()

    await changePasswordMutation.mutateAsync({
      new_password: values.password,
    })

    reset(changePasswordDefaultValues)
  }

  return (
    <Stack sx={screenSx}>
      <Box sx={scrollableContentSx}>
        <Paper elevation={0} sx={formCardSx}>
          <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1.1}>
              <AuthTextField
                autoComplete="new-password"
                autoFocus
                errorMessage={errors.password?.message}
                icon={<PasswordRoundedIcon />}
                label="New Password"
                placeholder="Enter your new password"
                registration={register('password')}
                textFieldSx={neutralFieldSx}
                type="password"
              />
              <AuthTextField
                autoComplete="new-password"
                errorMessage={errors.confirmPassword?.message}
                icon={<PasswordRoundedIcon />}
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                registration={register('confirmPassword')}
                textFieldSx={neutralFieldSx}
                type="password"
              />

              {changePasswordMutation.isSuccess ? (
                <Alert severity="success" variant="outlined">
                  Password updated successfully.
                </Alert>
              ) : null}

              {changePasswordMutation.isError ? (
                <Alert severity="error" variant="outlined">
                  {getApiErrorMessage(
                    changePasswordMutation.error,
                    'Password update failed. Please try again.',
                  )}
                </Alert>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      </Box>

      <Box sx={footerSx}>
        <Stack spacing={0.9}>
          <Button
            disabled={isSubmitting || changePasswordMutation.isPending}
            onClick={handleSubmit(onSubmit)}
            size="large"
            sx={submitButtonSx}
            variant="contained"
          >
            {changePasswordMutation.isPending ? 'Updating Password...' : 'Update Password'}
          </Button>
          <Button
            color="inherit"
            disabled={changePasswordMutation.isPending}
            onClick={() => navigateBackOrTo(navigate, '/profile')}
            size="large"
            startIcon={<ArrowBackRoundedIcon />}
            sx={cancelButtonSx}
            variant="outlined"
          >
            Back to profile
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

const screenSx = {
  height: {
    xs: 'calc(100svh - 58px)',
    sm: 'calc(100svh - 62px)',
  },
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: colors.surfaceContainerLowest,
} as const

const scrollableContentSx = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  pb: 1.5,
} as const

const formCardSx = {
  borderRadius: 2,
  border: `1px solid ${alpha(colors.outlineVariant, 0.92)}`,
  px: { xs: 2, sm: 2.25 },
  py: 2.1,
  backgroundColor: colors.surfaceContainerLowest,
  boxShadow: 'none',
} as const

const neutralFieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.surfaceContainerLowest,
  },
} as const

const footerSx = {
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  flexShrink: 0,
  borderTop: `1px solid ${alpha(colors.outlineVariant, 0.95)}`,
  backgroundColor: colors.surfaceContainerLowest,
  pt: 1.5,
  pb: 'calc(24px + env(safe-area-inset-bottom))',
} as const

const submitButtonSx = {
  backgroundColor: colors.primaryContainer,
  '&:hover': {
    backgroundColor: colors.primary,
  },
} as const

const cancelButtonSx = {
  borderColor: colors.outlineVariant,
  boxShadow: 'none',
  color: colors.onSurfaceVariant,
  '&:hover': {
    borderColor: colors.onSurfaceVariant,
    backgroundColor: colors.surfaceContainerLow,
    boxShadow: 'none',
  },
} as const
