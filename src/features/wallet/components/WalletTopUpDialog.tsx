import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useWalletTopUpMutation } from '../hooks/useWalletTopUpMutation'

const walletTopUpSchema = yup
  .object({
    amount: yup
      .string()
      .required('Enter an amount greater than $0.00.')
      .test('valid-format', 'Use up to 2 decimal places.', (value) => {
        const trimmedValue = value?.trim() ?? ''

        if (!trimmedValue) {
          return true
        }

        return amountInputPattern.test(trimmedValue)
      })
      .test('positive-amount', 'Enter an amount greater than $0.00.', (value) => {
        const parsedAmount = parseAmountInput(value ?? '')

        if (parsedAmount === null) {
          return true
        }

        return parsedAmount > 0
      }),
  })
  .required()

type WalletTopUpDialogProps = {
  onClose: () => void
  onSuccess: (message: string) => void
  open: boolean
}

type WalletTopUpFormValues = yup.InferType<typeof walletTopUpSchema>

const topUpQuickAddAmounts = [50, 100, 250] as const
const amountInputPattern = /^(?:\d+|\d+\.\d{0,2}|\.\d{1,2})$/

export function WalletTopUpDialog({
  onClose,
  onSuccess,
  open,
}: WalletTopUpDialogProps) {
  const topUpMutation = useWalletTopUpMutation()
  const resetTopUpMutation = topUpMutation.reset
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
    trigger,
  } = useForm<WalletTopUpFormValues>({
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
    resolver: yupResolver(walletTopUpSchema),
  })
  const amountValue = useWatch({
    control,
    name: 'amount',
  }) ?? ''

  useEffect(() => {
    if (!open) {
      reset({ amount: '' })
      resetTopUpMutation()
      return
    }

    reset({ amount: '' })
    resetTopUpMutation()
  }, [open, reset, resetTopUpMutation])

  const onSubmit = handleSubmit(async (values) => {
    const parsedAmount = parseAmountInput(values.amount)

    if (parsedAmount === null || parsedAmount <= 0) {
      return
    }

    await topUpMutation.mutateAsync({
      amountUsd: Number(parsedAmount.toFixed(2)),
    })

    onSuccess('Wallet topped up successfully.')
  })

  function handleAddAmount(incrementAmount: number) {
    const trimmedAmountValue = amountValue.trim()
    const parsedAmount = parseAmountInput(trimmedAmountValue)

    if (trimmedAmountValue && parsedAmount === null) {
      void trigger('amount')
      return
    }

    setValue('amount', formatAmountInput((parsedAmount ?? 0) + incrementAmount), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={topUpMutation.isPending ? undefined : onClose}
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
              Top Up Wallet
            </Typography>
          </Stack>

          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <TextField
                disabled={topUpMutation.isPending}
                error={Boolean(errors.amount)}
                fullWidth
                helperText={errors.amount?.message}
                inputRef={field.ref}
                label="Amount"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.value)}
                placeholder="Enter amount"
                slotProps={{
                  htmlInput: {
                    inputMode: 'decimal',
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{
                            color: colors.onSurfaceVariant,
                            fontWeight: 700,
                          }}
                        >
                          $
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiFormHelperText-root': {
                    mt: 0.75,
                  },
                }}
                value={field.value ?? ''}
              />
            )}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
            }}
          >
            {topUpQuickAddAmounts.map((quickAddAmount) => (
              <Chip
                clickable
                disabled={topUpMutation.isPending}
                key={quickAddAmount}
                label={`+${quickAddAmount}`}
                onClick={() => handleAddAmount(quickAddAmount)}
                sx={{
                  height: 36,
                  borderRadius: 999,
                  border: `1px solid ${colors.outlineVariant}`,
                  backgroundColor: colors.surfaceContainerLowest,
                  color: colors.primaryContainer,
                  fontFamily: '"Lexend", sans-serif',
                  fontWeight: 700,
                  '& .MuiChip-label': {
                    px: 1.75,
                  },
                }}
              />
            ))}
          </Stack>

          {topUpMutation.isError ? (
            <Alert severity="error" variant="outlined">
              {getApiErrorMessage(
                topUpMutation.error,
                'We could not top up this wallet. Please try again.',
              )}
            </Alert>
          ) : null}

          <Stack spacing={1.1}>
            <Button
              disabled={!isValid || topUpMutation.isPending}
              size="large"
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
              {topUpMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
            <Button
              disabled={topUpMutation.isPending}
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

function parseAmountInput(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue || !amountInputPattern.test(trimmedValue)) {
    return null
  }

  const parsedAmount = Number.parseFloat(trimmedValue)

  if (!Number.isFinite(parsedAmount)) {
    return null
  }

  return parsedAmount
}

function formatAmountInput(value: number) {
  return value.toFixed(2)
}
