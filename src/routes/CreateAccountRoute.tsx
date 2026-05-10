import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { colors } from '../colors'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthTextField } from '../features/auth/AuthTextField'
import { useRegisterMutation } from '../features/auth/hooks/useRegisterMutation'
import {
  createAccountDefaultValues,
  createAccountSchema,
  type CreateAccountFormValues,
} from '../features/auth/authSchemas'
import { getApiErrorMessage } from '../lib/api/errors'

function CreateAccountRoute() {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    defaultValues: createAccountDefaultValues,
    resolver: yupResolver(createAccountSchema),
  })

  const onSubmit = async (values: CreateAccountFormValues) => {
    registerMutation.reset()

    const response = await registerMutation.mutateAsync({
      email: values.email,
      org_name: values.organizationName,
      password: values.password,
    })

    if (response.data?.token) {
      navigate('/packs', { replace: true })
      return
    }

    if (response.data?.message) {
      toast.info(response.data.message, {
        toastId: 'registration-pending-approval',
      })
      navigate('/login', { replace: true })
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <AuthLayout
      footerLinkLabel="Login"
      footerLinkPrefix="Already have an account?"
      footerLinkTo="/login"
    >
      <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.1}>
          <AuthTextField
            autoComplete="organization"
            autoFocus
            errorMessage={errors.organizationName?.message}
            icon={<ApartmentOutlinedIcon />}
            label="Organization Name"
            placeholder="Jetpac Operations"
            registration={register('organizationName')}
          />
          <AuthTextField
            autoComplete="email"
            errorMessage={errors.email?.message}
            icon={<AlternateEmailIcon />}
            label="Email Address"
            placeholder="name@company.com"
            registration={register('email')}
            type="email"
          />
          <AuthTextField
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            icon={<LockOutlinedIcon />}
            label="Password"
            placeholder="Enter your password"
            registration={register('password')}
            type="password"
          />
          <AuthTextField
            autoComplete="new-password"
            errorMessage={errors.confirmPassword?.message}
            icon={<LockOutlinedIcon />}
            label="Confirm Password"
            placeholder="Re-enter your password"
            registration={register('confirmPassword')}
            type="password"
          />
          {registerMutation.isError ? (
            <Alert severity="error" variant="outlined">
              {getApiErrorMessage(
                registerMutation.error,
                'Account creation failed. Please try again.',
              )}
            </Alert>
          ) : null}
        </Stack>

        <Stack spacing={2.5} sx={{ pt: 4 }}>
          <Button
            disabled={isSubmitting || registerMutation.isPending}
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
            Create Account
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}

export default CreateAccountRoute
