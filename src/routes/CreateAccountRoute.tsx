import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { colors } from '../colors'
import { AuthLayout } from '../features/auth/AuthLayout'
import { AuthTextField } from '../features/auth/AuthTextField'
import {
  createAccountDefaultValues,
  createAccountSchema,
  type CreateAccountFormValues,
} from '../features/auth/authSchemas'

function CreateAccountRoute() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    defaultValues: createAccountDefaultValues,
    resolver: yupResolver(createAccountSchema),
  })

  const onSubmit = async () => {
    navigate('/packs')
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
            Create Account
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}

export default CreateAccountRoute
