import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { colors } from '../../colors'
import { BottomSheet } from './BottomSheet'

type FilterSheetOption<TValue extends string | number> = {
  label: string
  value: TValue
}

type FilterSheetProps<TValue extends string | number> = {
  onClear: () => void
  onClose: () => void
  onSelect: (value: TValue) => void
  open: boolean
  options: FilterSheetOption<TValue>[]
  selectedValue?: TValue
  title: string
}

export function FilterSheet<TValue extends string | number>({
  onClear,
  onClose,
  onSelect,
  open,
  options,
  selectedValue,
  title,
}: FilterSheetProps<TValue>) {
  return (
    <BottomSheet onClose={onClose} open={open} title={title} zIndex={1400}>
      <Stack spacing={2}>
        <List disablePadding sx={{ mx: -1 }}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue

            return (
              <ListItemButton
                key={String(option.value)}
                onClick={() => onSelect(option.value)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: colors.onSurface,
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {option.label}
                    </Typography>
                  }
                />
                {isSelected ? (
                  <CheckRoundedIcon
                    sx={{
                      color: colors.primaryContainer,
                    }}
                  />
                ) : null}
              </ListItemButton>
            )
          })}
        </List>

        {options.length === 0 ? (
          <Typography sx={{ color: colors.onSurfaceVariant }}>
            No options are available for this filter.
          </Typography>
        ) : null}

        {selectedValue !== undefined ? (
          <Button
            color="inherit"
            onClick={onClear}
            sx={{
              alignSelf: 'stretch',
              color: colors.primaryContainer,
              border: `1px solid ${colors.outlineVariant}`,
              backgroundColor: colors.surfaceContainerLowest,
            }}
            variant="outlined"
          >
            Clear filter
          </Button>
        ) : null}
      </Stack>
    </BottomSheet>
  )
}
