import { yupResolver } from '@hookform/resolvers/yup'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import { useInventoryQuery } from '../../inventory/hooks/useInventoryQuery'
import { getInventoryPackAssignmentSummary } from '../../inventory/utils/inventorySelectors'
import { AssignmentRecipientCard } from '../components/AssignmentRecipientCard'
import {
  assignmentDefaultValues,
  createAssignmentSchema,
} from '../utils/assignmentSchemas'
import { useSubmitAssignmentsMutation } from '../hooks/useSubmitAssignmentsMutation'
import type { AssignmentFormValues, AssignmentPackSummary } from '../types'

export function AssignmentScreen() {
  const navigate = useNavigate()
  const { packId } = useParams()
  const inventoryQuery = useInventoryQuery()

  useAuthenticatedHeader({
    hideBottomNavigation: true,
    title: 'Inventory',
  })

  const assignmentPack =
    packId && inventoryQuery.data
      ? getInventoryPackAssignmentSummary(inventoryQuery.data, packId)
      : undefined

  if (inventoryQuery.isPending) {
    return (
      <Stack
        sx={{
          minHeight: '60svh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (!packId || inventoryQuery.isError || !assignmentPack) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${colors.outlineVariant}`,
          px: 2.5,
          py: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ color: colors.onSurface }}>
            This inventory pack could not be loaded
          </Typography>
          <Typography sx={{ color: colors.onSurfaceVariant }}>
            {inventoryQuery.isError
              ? getApiErrorMessage(
                  inventoryQuery.error,
                  'We could not load the selected pack from live inventory.',
                )
              : 'The selected pack is no longer available in unassigned inventory.'}
          </Typography>
          <Button
            onClick={() => navigate('/inventory')}
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: colors.primaryContainer,
              '&:hover': {
                backgroundColor: colors.primary,
              },
            }}
            variant="contained"
          >
            Go back
          </Button>
        </Stack>
      </Paper>
    )
  }

  return <AssignmentScreenContent packSummary={assignmentPack} />
}

type AssignmentScreenContentProps = {
  packSummary: AssignmentPackSummary
}

function AssignmentScreenContent({ packSummary }: AssignmentScreenContentProps) {
  const navigate = useNavigate()
  const submitAssignmentsMutation = useSubmitAssignmentsMutation()
  const [successOpen, setSuccessOpen] = useState(false)

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
  } = useForm<AssignmentFormValues>({
    defaultValues: assignmentDefaultValues,
    mode: 'onChange',
    resolver: yupResolver(createAssignmentSchema(packSummary.quantity)),
  })

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'assignments',
  })

  const assignments = useWatch({
    control,
    name: 'assignments',
  }) ?? []
  const totalAssigned = assignments.reduce(
    (sum, assignment) => sum + (assignment.quantity || 0),
    0,
  )
  const remaining = Math.max(packSummary.quantity - totalAssigned, 0)
  const hasRows = fields.length > 0
  const exceedsTotal = totalAssigned > packSummary.quantity
  const assignNowDisabled =
    !hasRows || exceedsTotal || !isValid || submitAssignmentsMutation.isPending

  useEffect(() => {
    if (!successOpen) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/inventory')
    }, 900)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [navigate, successOpen])

  const onSubmit = handleSubmit(async (values) => {
    await submitAssignmentsMutation.mutateAsync({
      packId: packSummary.packId,
      assignments: values.assignments.map((assignment) => ({
        email: assignment.email.trim(),
        quantity: assignment.quantity,
      })),
    })

    setSuccessOpen(true)
  })

  function updateQuantity(index: number, direction: 'increase' | 'decrease') {
    const currentQuantity = assignments[index]?.quantity ?? 1
    const otherRowsQuantity = assignments.reduce((sum, assignment, rowIndex) => {
      if (rowIndex === index) {
        return sum
      }

      return sum + assignment.quantity
    }, 0)
    const maxQuantity = Math.max(packSummary.quantity - otherRowsQuantity, 1)
    const nextQuantity =
      direction === 'increase'
        ? Math.min(currentQuantity + 1, maxQuantity)
        : Math.max(currentQuantity - 1, 1)

    setValue(`assignments.${index}.quantity`, nextQuantity, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  function handleAddRecipient() {
    if (remaining <= 0) {
      return
    }

    append({
      email: '',
      quantity: 1,
    })
  }

  return (
    <>
      <Stack spacing={2.25}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '8px',
            border: `1px solid ${colors.outlineVariant}`,
            px: 2.5,
            py: 1.75,
            boxShadow: `0 14px 32px ${alpha(colors.primary, 0.06)}`,
          }}
        >
          <Stack spacing={1.5}>
            <Typography
              variant="h2"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1.12rem', sm: '1.2rem' },
                lineHeight: 1.25,
              }}
            >
              {packSummary.packName}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 1.25,
              }}
            >
              <SummaryTile label="Total Quantity" value={packSummary.quantity} />
              <SummaryTile accent label="Remaining" value={remaining} />
            </Box>
          </Stack>
        </Paper>

        <Stack component="form" noValidate onSubmit={onSubmit} spacing={2.25}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: colors.onSurface,
                fontSize: { xs: '1rem', sm: '1.05rem' },
              }}
            >
              Assign Packs
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {fields.map((field, index) => {
              const otherRowsQuantity = assignments.reduce(
                (sum, assignment, rowIndex) => {
                  if (rowIndex === index) {
                    return sum
                  }

                  return sum + assignment.quantity
                },
                0,
              )
              const maxQuantity = Math.max(packSummary.quantity - otherRowsQuantity, 1)

              return (
                <AssignmentRecipientCard
                  key={field.id}
                  emailError={errors.assignments?.[index]?.email}
                  emailName={`assignments.${index}.email`}
                  maxQuantity={maxQuantity}
                  onDecrease={() => updateQuantity(index, 'decrease')}
                  onIncrease={() => updateQuantity(index, 'increase')}
                  onRemove={() => remove(index)}
                  quantity={assignments[index]?.quantity ?? 1}
                  quantityError={errors.assignments?.[index]?.quantity}
                  register={register}
                />
              )
            })}

            <Button
              disabled={remaining === 0}
              onClick={handleAddRecipient}
              startIcon={<AddCircleOutlineRoundedIcon />}
              type="button"
              sx={{
                minHeight: 48,
                borderRadius: '8px',
                borderStyle: 'dashed',
                color: colors.onSurfaceVariant,
                backgroundColor: colors.surfaceContainerLowest,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: colors.surfaceContainerLow,
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  borderColor: colors.outlineVariant,
                },
              }}
              variant="outlined"
            >
              Add Recipient
            </Button>

            {typeof errors.assignments?.message === 'string' ? (
              <Alert severity="error" variant="outlined">
                {errors.assignments.message}
              </Alert>
            ) : null}

            {submitAssignmentsMutation.isError ? (
              <Alert severity="error" variant="outlined">
                {getApiErrorMessage(
                  submitAssignmentsMutation.error,
                  'We could not assign this inventory. Please try again.',
                )}
              </Alert>
            ) : null}
          </Stack>

          <Stack spacing={1.25} sx={{ pt: 1.5 }}>
            <Button
              disabled={assignNowDisabled}
              size="large"
              sx={{
                minHeight: 48,
                borderRadius: '8px',
                backgroundColor: colors.primaryContainer,
                '&:hover': {
                  backgroundColor: colors.primary,
                },
              }}
              type="submit"
              variant="contained"
            >
              {submitAssignmentsMutation.isPending ? 'Assigning...' : 'Assign now'}
            </Button>
            <Button
              onClick={() => navigate('/inventory')}
              size="large"
              type="button"
              sx={{
                minHeight: 48,
                borderRadius: '8px',
                color: colors.primaryContainer,
                borderColor: colors.primaryContainer,
                backgroundColor: colors.surfaceContainerLowest,
                boxShadow: 'none',
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: alpha(colors.primaryFixed, 0.28),
                  boxShadow: 'none',
                },
              }}
              variant="outlined"
            >
              Assign later
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Snackbar
        autoHideDuration={1200}
        onClose={() => setSuccessOpen(false)}
        open={successOpen}
      >
        <Alert severity="success" sx={{ width: '100%' }} variant="filled">
          Inventory assigned successfully.
        </Alert>
      </Snackbar>
    </>
  )
}

type SummaryTileProps = {
  accent?: boolean
  label: string
  value: number
}

function SummaryTile({ accent = false, label, value }: SummaryTileProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '14px',
        border: `1px solid ${alpha(colors.outlineVariant, 0.75)}`,
        px: 1.75,
        py: 1.1,
        backgroundColor: colors.surfaceContainerLow,
      }}
    >
      <Stack spacing={0.5}>
        <Typography
          variant="overline"
          sx={{
            color: colors.onSurfaceVariant,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: accent ? colors.primaryContainer : colors.onSurface,
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Paper>
  )
}
