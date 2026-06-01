import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LoginIcon from '@mui/icons-material/Login'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Button, Link as MuiLink, Stack } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router'
import { colors } from '../../../colors'
import { AuthLayout } from '../components/AuthLayout'
import { AuthTextField } from '../components/AuthTextField'
import { useLoginMutation } from '../hooks/useLoginMutation'
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from '../utils/authSchemas'
import { getApiErrorMessage } from '../../../lib/api/errors'

export function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLoginMutation()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: loginDefaultValues,
    resolver: yupResolver(loginSchema),
  })

  const emailValue = useWatch({
    control,
    name: 'email',
    defaultValue: loginDefaultValues.email,
  })

  const redirectTo =
    location.state &&
    typeof location.state === 'object' &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : '/packs'

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.reset()
    await loginMutation.mutateAsync(values)
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout
      // footerLinkLabel="Create Account"
      // footerLinkPrefix="New here?"
      // footerLinkTo="/create-account"
    >
      <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.1}>
          <AuthTextField
            autoComplete="email"
            autoFocus
            errorMessage={errors.email?.message}
            icon={<AlternateEmailIcon />}
            label="Email Address"
            placeholder="name@company.com"
            registration={register('email')}
            type="email"
          />
          <AuthTextField
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            icon={<LockOutlinedIcon />}
            label="Password"
            placeholder="Enter your password"
            registration={register('password')}
            type="password"
          />
          <Stack sx={{ alignItems: 'flex-end', mt: -0.5 }}>
            <MuiLink
              component={RouterLink}
              state={{ email: emailValue }}
              to="/forgot-password"
              underline="hover"
              sx={{
                color: colors.primaryContainer,
                fontSize: '0.875rem',
                fontWeight: 600,
                textUnderlineOffset: '0.2em',
              }}
            >
              Forgot password?
            </MuiLink>
          </Stack>
          {loginMutation.isError ? (
            <Alert severity="error" variant="outlined">
              {getApiErrorMessage(
                loginMutation.error,
                'Login failed. Please check your credentials and try again.',
              )}
            </Alert>
          ) : null}
        </Stack>

        <Stack spacing={2.5} sx={{ pt: 4 }}>
          <Button
            disabled={isSubmitting || loginMutation.isPending}
            endIcon={<LoginIcon />}
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
            Login
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}
