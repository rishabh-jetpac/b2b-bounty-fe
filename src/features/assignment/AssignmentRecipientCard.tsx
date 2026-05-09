import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { FieldError, UseFormRegister } from 'react-hook-form'
import { colors } from '../../colors'
import type { AssignmentFormValues } from './types'

type AssignmentRecipientCardProps = {
  emailError?: FieldError
  emailName: `assignments.${number}.email`
  maxQuantity: number
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
  quantity: number
  quantityError?: FieldError
  register: UseFormRegister<AssignmentFormValues>
}

export function AssignmentRecipientCard({
  emailError,
  emailName,
  maxQuantity,
  onDecrease,
  onIncrease,
  onRemove,
  quantity,
  quantityError,
  register,
}: AssignmentRecipientCardProps) {
  const canDecrease = quantity > 1
  const canIncrease = quantity < maxQuantity

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: `1px solid ${colors.outlineVariant}`,
        px: 2,
        py: 2.25,
        boxShadow: '0 12px 28px rgba(0, 61, 155, 0.06)',
      }}
    >
      <Stack spacing={2}>
        <TextField
          {...register(emailName)}
          error={Boolean(emailError)}
          fullWidth
          helperText={emailError?.message ?? ' '}
          label="Recipient Email"
          placeholder="name@company.com"
          type="email"
          sx={{
            '& .MuiFormHelperText-root': {
              minHeight: 22,
              mt: 0.75,
            },
          }}
        />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            rowGap: 1.5,
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              border: `1px solid ${colors.outlineVariant}`,
              borderRadius: 999,
              backgroundColor: colors.surfaceContainerLow,
              overflow: 'hidden',
            }}
          >
            <IconButton
              aria-label="Decrease quantity"
              disabled={!canDecrease}
              onClick={onDecrease}
              type="button"
              sx={stepperActionSx}
            >
              <RemoveRoundedIcon />
            </IconButton>
            <Box
              sx={{
                minWidth: 60,
                px: 2.5,
                py: 1.5,
                borderLeft: `1px solid ${colors.outlineVariant}`,
                borderRight: `1px solid ${colors.outlineVariant}`,
              }}
            >
              <Typography
                sx={{
                  color: colors.onSurface,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {quantity}
              </Typography>
            </Box>
            <IconButton
              aria-label="Increase quantity"
              disabled={!canIncrease}
              onClick={onIncrease}
              type="button"
              sx={stepperActionSx}
            >
              <AddRoundedIcon />
            </IconButton>
          </Stack>

          <IconButton
            aria-label="Remove recipient"
            onClick={onRemove}
            type="button"
            sx={{
              borderRadius: 999,
              color: colors.error,
              px: 1.5,
              '&:hover': {
                backgroundColor: `${colors.errorContainer}80`,
              },
            }}
          >
            <DeleteOutlineRoundedIcon />
            <Typography
              component="span"
              sx={{
                ml: 0.75,
                fontFamily: '"Lexend", sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
              }}
            >
              Remove
            </Typography>
          </IconButton>
        </Stack>

        {quantityError ? (
          <Typography
            sx={{
              color: colors.error,
              fontSize: '0.8rem',
              mt: -0.75,
            }}
          >
            {quantityError.message}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  )
}

const stepperActionSx = {
  width: 48,
  height: 48,
  borderRadius: 0,
  color: colors.onSurface,
  '&.Mui-disabled': {
    color: colors.outlineVariant,
  },
} as const
