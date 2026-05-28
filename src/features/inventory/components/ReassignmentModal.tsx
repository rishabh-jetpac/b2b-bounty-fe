import { yupResolver } from '@hookform/resolvers/yup'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useReassignInventoryMutation } from '../hooks/useReassignInventoryMutation'
import type { ReassignmentFormValues, InventoryItem } from '../types'

const reassignmentSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Enter a valid email address.')
      .required('Email address is required.'),
  })
  .required()

type ReassignmentModalProps = {
  item: InventoryItem | null
  onClose: () => void
  onSuccess: (message: string) => void
  open: boolean
}

export function ReassignmentModal({
  item,
  onClose,
  onSuccess,
  open,
}: ReassignmentModalProps) {
  const reassignMutation = useReassignInventoryMutation()
  const resetReassignMutation = reassignMutation.reset
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<ReassignmentFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: yupResolver(reassignmentSchema),
  })

  useEffect(() => {
    if (!open || !item) {
      resetForm({ email: '' })
      resetReassignMutation()
      return
    }

    resetForm({
      email: item.recipientEmail ?? '',
    })
  }, [item, open, resetForm, resetReassignMutation])

  const onSubmit = handleSubmit(async (values) => {
    if (!item) {
      return
    }

    await reassignMutation.mutateAsync({
      email: values.email.trim(),
      inventoryId: item.id,
    })

    onSuccess(`Reassigned ${item.packName} successfully.`)
  })

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={reassignMutation.isPending ? undefined : onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            border: `1px solid ${colors.outlineVariant}`,
            boxShadow: `0 24px 48px ${alpha(colors.primary, 0.22)}`,
            overflow: 'hidden',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: alpha(colors.inverseSurface, 0.38),
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <DialogContent sx={{ px: 3, py: 3.5 }}>
        <Stack component="form" noValidate onSubmit={onSubmit} spacing={2.25}>
          <Stack spacing={1.25} sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.5rem', sm: '1.5rem' },
              }}
            >
              Reassign Pack
            </Typography>
          </Stack>

          {item ? (
            <Stack
              spacing={0.4}
              sx={{
                px: 1,
                py: 1.5,
                borderRadius: '16px',
                backgroundColor: colors.surfaceContainerLow,
                border: `1px solid ${colors.outlineVariant}`,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: colors.onSurfaceVariant,
                }}
              >
                Selected Inventory
              </Typography>
              <Typography
                sx={{
                  color: colors.onSurface,
                  fontSize: '1rem',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {item.packName}
              </Typography>
              <Typography
                sx={{
                  color: colors.onSurfaceVariant,
                  fontSize: '0.94rem',
                  lineHeight: 1.45,
                  overflowWrap: 'anywhere',
                }}
              >
                Current: {item.recipientEmail ?? 'Unavailable'}
              </Typography>
            </Stack>
          ) : null}

          <TextField
            {...register('email')}
            error={Boolean(errors.email)}
            fullWidth
            helperText={errors.email?.message ?? ' '}
            label="New Recipient Email"
            placeholder="name@company.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon />
                  </InputAdornment>
                ),
              },
            }}
            type="email"
            sx={{
              '& .MuiFormHelperText-root': {
                minHeight: 22,
                mt: 0.75,
              },
            }}
          />

          {reassignMutation.isError ? (
            <Alert severity="error" variant="outlined">
              {getApiErrorMessage(
                reassignMutation.error,
                'We could not reassign this pack. Please try again.',
              )}
            </Alert>
          ) : null}

          <Stack spacing={1.1}>
            <Button
              disabled={!isValid || reassignMutation.isPending}
              size="large"
              startIcon={<CheckRoundedIcon />}
              sx={{
                minHeight: 54,
                backgroundColor: colors.primaryContainer,
                '&:hover': {
                  backgroundColor: colors.primary,
                },
              }}
              type="submit"
              variant="contained"
            >
              {reassignMutation.isPending ? 'Confirming...' : 'Confirm'}
            </Button>
            <Button
              disabled={reassignMutation.isPending}
              onClick={onClose}
              size="large"
              sx={{
                minHeight: 54,
                color: colors.onSurfaceVariant,
                borderColor: colors.outline,
                backgroundColor: colors.surfaceContainerLowest,
                boxShadow: 'none',
                '&:hover': {
                  borderColor: colors.primaryContainer,
                  backgroundColor: colors.surfaceContainerLow,
                  boxShadow: 'none',
                },
              }}
              type="button"
              variant="outlined"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
