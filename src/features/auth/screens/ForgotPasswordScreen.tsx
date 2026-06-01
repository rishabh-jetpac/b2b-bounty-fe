import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import { Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { colors } from '../../../colors'
import { AuthLayout } from '../components/AuthLayout'
import { AuthTextField } from '../components/AuthTextField'
import {
  forgotPasswordDefaultValues,
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../utils/authSchemas'

function getPrefilledEmail(state: unknown) {
  if (!state || typeof state !== 'object' || !('email' in state)) {
    return ''
  }

  const email = state.email
  return typeof email === 'string' ? email : ''
}

export function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      ...forgotPasswordDefaultValues,
      email: getPrefilledEmail(location.state),
    },
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async () => {
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <Stack spacing={3}>
          <Stack spacing={1.25} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <MarkEmailReadOutlinedIcon
              sx={{
                color: colors.primaryContainer,
                fontSize: 44,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.5rem', sm: '1.7rem' },
                lineHeight: 1.2,
              }}
            >
              Check your email
            </Typography>
            <Typography
              sx={{
                color: colors.onSurfaceVariant,
                fontSize: '0.95rem',
                lineHeight: 1.5,
                maxWidth: 360,
              }}
            >
              If an account exists for this email, we&apos;ve sent a reset link with
              instructions to change your password.
            </Typography>
          </Stack>

          <Button
            fullWidth
            onClick={() => navigate('/login', { replace: true })}
            size="large"
            startIcon={<ArrowBackOutlinedIcon />}
            sx={{
              backgroundColor: colors.primaryContainer,
              '&:hover': {
                backgroundColor: colors.primary,
              },
            }}
            variant="contained"
          >
            Back to login
          </Button>
        </Stack>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      footerLinkLabel="Login"
      footerLinkPrefix="Remembered your password?"
      footerLinkTo="/login"
    >
      <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
              Forgot Password
            </Typography>
            <Typography
              sx={{
                color: colors.onSurfaceVariant,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Enter your email address and we&apos;ll send you a link to reset your
              password.
            </Typography>
          </Stack>

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
            Send reset link
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}
