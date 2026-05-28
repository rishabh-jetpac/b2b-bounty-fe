import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { colors } from '../../../colors'

interface AuthTextFieldProps {
  autoComplete?: string
  autoFocus?: boolean
  errorMessage?: string
  icon: ReactNode
  label: string
  placeholder: string
  registration: UseFormRegisterReturn
  type?: 'email' | 'password' | 'text'
}

export function AuthTextField({
  autoComplete,
  autoFocus = false,
  errorMessage,
  icon,
  label,
  placeholder,
  registration,
  type = 'text',
}: AuthTextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <Stack spacing={1.1}>
      <Typography
        component="label"
        htmlFor={registration.name}
        variant="overline"
        sx={{
          color: colors.onSurfaceVariant,
          pl: 0.75,
        }}
      >
        {label}
      </Typography>

      <TextField
        {...registration}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        error={Boolean(errorMessage)}
        fullWidth
        helperText={errorMessage}
        id={registration.name}
        placeholder={placeholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: isPasswordField ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  edge="end"
                  onClick={() => setIsPasswordVisible((value) => !value)}
                >
                  {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        type={isPasswordField && isPasswordVisible ? 'text' : type}
        sx={{
          '& .MuiFormHelperText-root': {
            minHeight: 22,
            mt: 0.75,
            mx: 1,
          },
        }}
      />
    </Stack>
  )
}
