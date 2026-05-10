import { yupResolver } from '@hookform/resolvers/yup'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import {
  Alert,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useAuthenticatedHeader } from '../app/useAuthenticatedHeader'
import { colors } from '../colors'
import { AuthTextField } from '../features/auth/AuthTextField'
import {
  createSubadminDefaultValues,
  createSubadminSchema,
  type CreateSubadminFormValues,
} from '../features/auth/authSchemas'
import { useCreateSubadminMutation } from '../features/auth/hooks/useCreateSubadminMutation'
import { getApiErrorMessage } from '../lib/api/errors'
import { useAuthStore } from '../store/authStore'

function CreateSubadminRoute() {
  const organizationName = useAuthStore((state) => state.user?.orgName ?? '')
  const createSubadminMutation = useCreateSubadminMutation()
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubadminFormValues>({
    defaultValues: createSubadminDefaultValues,
    resolver: yupResolver(createSubadminSchema),
  })

  useAuthenticatedHeader({
    title: 'Create Subadmin',
  })

  const onSubmit = async (values: CreateSubadminFormValues) => {
    createSubadminMutation.reset()

    await createSubadminMutation.mutateAsync({
      email: values.email,
      password: values.password,
    })

    resetField('password')
    resetField('confirmPassword')
  }

  return (
    <Stack spacing={2.25}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${colors.outlineVariant}`,
          p: { xs: 2.25, sm: 2.75 },
          backgroundColor: colors.surfaceContainerLowest,
          boxShadow: `0 18px 40px ${alpha(colors.primary, 0.08)}`,
        }}
      >
        <Stack spacing={0.75} sx={{ mb: 2.75 }}>
          <Typography
            variant="h2"
            sx={{
              color: colors.onSurface,
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              lineHeight: 1.2,
            }}
          >
            Add a subadmin
          </Typography>
        </Stack>

        <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1.1}>
            <Stack spacing={1.1}>
              <Typography
                component="label"
                htmlFor="organizationName"
                variant="overline"
                sx={{
                  color: colors.onSurfaceVariant,
                  pl: 0.75,
                }}
              >
                Organization Name
              </Typography>
              <TextField
                autoComplete="organization"
                disabled
                fullWidth
                id="organizationName"
                placeholder="Organization name"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                value={organizationName}
              />
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
            <AuthTextField
              autoComplete="new-password"
              errorMessage={errors.password?.message}
              icon={<LockOutlinedIcon />}
              label="Password"
              placeholder="Enter a password"
              registration={register('password')}
              type="password"
            />
            <AuthTextField
              autoComplete="new-password"
              errorMessage={errors.confirmPassword?.message}
              icon={<LockOutlinedIcon />}
              label="Confirm Password"
              placeholder="Re-enter the password"
              registration={register('confirmPassword')}
              type="password"
            />
            {createSubadminMutation.isSuccess ? (
              <Alert severity="success" variant="outlined">
                Subadmin user created successfully.
              </Alert>
            ) : null}
            {createSubadminMutation.isError ? (
              <Alert severity="error" variant="outlined">
                {getApiErrorMessage(
                  createSubadminMutation.error,
                  'Subadmin creation failed. Please try again.',
                )}
              </Alert>
            ) : null}
          </Stack>

          <Stack spacing={2.5} sx={{ pt: 4 }}>
            <Button
              disabled={isSubmitting || createSubadminMutation.isPending}
              endIcon={<PersonAddAlt1OutlinedIcon />}
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
              Create Subadmin User
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default CreateSubadminRoute
