import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { colors } from '../../../colors'

type DestinationSearchFieldProps = {
  onChange: (value: string) => void
  onClear: () => void
  value: string
}

export function DestinationSearchField({
  onChange,
  onClear,
  value,
}: DestinationSearchFieldProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        px: 0.25,
        pt: 1,
        pb: 1,
        backgroundColor: colors.surfaceContainerLowest,
      }}
    >
      <TextField
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search destinations"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear destination search"
                  edge="end"
                  onClick={onClear}
                  sx={{ color: colors.outline }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: colors.surfaceContainerLowest,
            boxShadow: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(colors.outlineVariant, 0.95),
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primaryContainer,
          },
        }}
        value={value}
      />
    </Box>
  )
}
