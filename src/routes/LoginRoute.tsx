import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LoginIcon from '@mui/icons-material/Login'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { colors } from '../colors'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthTextField } from '../features/auth/AuthTextField'
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from '../features/auth/authSchemas'

function LoginRoute() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: loginDefaultValues,
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async () => {
    navigate('/packs')
  }

  return (
    <AuthLayout
      footerLinkLabel="Create Account"
      footerLinkPrefix="New here?"
      footerLinkTo="/create-account"
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
        </Stack>

        <Stack spacing={2.5} sx={{ pt: 4 }}>
          <Button
            disabled={isSubmitting}
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

export default LoginRoute
