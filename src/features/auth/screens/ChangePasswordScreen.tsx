import { yupResolver } from '@hookform/resolvers/yup'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined'
import { Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { colors } from '../../../colors'
import { AuthLayout } from '../components/AuthLayout'
import { AuthTextField } from '../components/AuthTextField'
import {
  changePasswordDefaultValues,
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../utils/authSchemas'

export function ChangePasswordScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: changePasswordDefaultValues,
    resolver: yupResolver(changePasswordSchema),
  })

  function handleValidSubmit() {
    // Password reset submission will be wired once the backend contract exists.
  }

  return (
    <AuthLayout footerLinkLabel="Login" footerLinkPrefix="Remembered your password?" footerLinkTo="/login">
      <Stack component="form" noValidate onSubmit={handleSubmit(handleValidSubmit)}>
        <Stack spacing={1.1}>
          <Stack spacing={0.75}>
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.5rem', sm: '1.7rem' },
                lineHeight: 1.2,
              }}
            >
              Change Password
            </Typography>
            <Typography
              sx={{
                color: colors.onSurfaceVariant,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Create a new password for your account.
            </Typography>
          </Stack>

          <AuthTextField
            autoComplete="new-password"
            autoFocus
            errorMessage={errors.password?.message}
            icon={<LockOutlinedIcon />}
            label="New Password"
            placeholder="Enter your new password"
            registration={register('password')}
            type="password"
          />
          <AuthTextField
            autoComplete="new-password"
            errorMessage={errors.confirmPassword?.message}
            icon={<PasswordOutlinedIcon />}
            label="Confirm Password"
            placeholder="Re-enter your new password"
            registration={register('confirmPassword')}
            type="password"
          />
        </Stack>

        <Stack spacing={2.5} sx={{ pt: 4 }}>
          <Button
            disabled={isSubmitting}
            size="large"
            sx={{
              backgroundColor: colors.primaryContainer,
              '&:hover': {
                backgroundColor: colors.primary,
              },
            }}
            type="submit"
            variant="contained"
          >
            Reset Password
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}
