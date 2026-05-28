import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Paper,
  Portal,
  Slide,
  Stack,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { colors } from '../../../colors'

type BottomSheetProps = {
  allowBackgroundInteraction?: boolean
  children: ReactNode
  fullWidth?: boolean
  hideHandle?: boolean
  onClose: () => void
  showCloseButton?: boolean
  showHeader?: boolean
  title?: string
  zIndex?: number
  open: boolean
}

export function BottomSheet({
  allowBackgroundInteraction = false,
  children,
  fullWidth = false,
  hideHandle = false,
  onClose,
  open,
  showCloseButton = true,
  showHeader = true,
  title,
  zIndex,
}: BottomSheetProps) {
  if (allowBackgroundInteraction) {
    return (
      <Portal>
        <Box
          sx={{
            position: 'fixed',
            inset: 'auto 0 0 0',
            zIndex: (theme) => zIndex ?? theme.zIndex.modal - 1,
            pointerEvents: 'none',
            pb: 'env(safe-area-inset-bottom)',
          }}
        >
          <Container
            disableGutters={fullWidth}
            maxWidth={fullWidth ? false : 'sm'}
            sx={{
              px: fullWidth ? 0 : { xs: 2, sm: 3 },
            }}
          >
            <Slide direction="up" in={open} mountOnEnter unmountOnExit>
              <Paper
                elevation={0}
                sx={{
                  pointerEvents: 'auto',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderBottomLeftRadius: fullWidth ? 0 : 24,
                  borderBottomRightRadius: fullWidth ? 0 : 24,
                  border: `1px solid ${colors.outlineVariant}`,
                  backgroundColor: colors.surfaceContainerLowest,
                  boxShadow: '0 -8px 24px rgba(0,0,0,0.12)',
                  pb: 2.5,
                  width: '100%',
                }}
              >
                <BottomSheetContent
                  hideHandle={hideHandle}
                  onClose={onClose}
                  showCloseButton={showCloseButton}
                  showHeader={showHeader}
                  title={title}
                >
                  {children}
                </BottomSheetContent>
              </Paper>
            </Slide>
          </Container>
        </Box>
      </Portal>
    )
  }

  return (
    <Drawer
      anchor="bottom"
      ModalProps={{ keepMounted: true }}
      onClose={onClose}
      open={open}
      sx={zIndex ? { zIndex } : undefined}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: colors.surfaceContainerLowest,
            maxWidth: 520,
            width: '100%',
            mx: 'auto',
            pb: 'calc(20px + env(safe-area-inset-bottom))',
          },
        },
      }}
    >
      <BottomSheetContent
        hideHandle={hideHandle}
        onClose={onClose}
        showCloseButton={showCloseButton}
        showHeader={showHeader}
        title={title}
      >
        {children}
      </BottomSheetContent>
    </Drawer>
  )
}

type BottomSheetContentProps = {
  children: ReactNode
  hideHandle: boolean
  onClose: () => void
  showCloseButton: boolean
  showHeader: boolean
  title?: string
}

function BottomSheetContent({
  children,
  hideHandle,
  onClose,
  showCloseButton,
  showHeader,
  title,
}: BottomSheetContentProps) {
  return (
    <Stack spacing={2.5} sx={{ px: { xs: 2, sm: 3 }, pt: 1.5 }}>
      {hideHandle ? null : (
        <Box
          sx={{
            width: 48,
            height: 4,
            borderRadius: 999,
            backgroundColor: colors.outlineVariant,
            mx: 'auto',
          }}
        />
      )}

      {showHeader ? (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: title ? 'space-between' : 'flex-end',
          }}
        >
          {title ? (
            <Typography variant="h3" sx={{ color: colors.onSurface }}>
              {title}
            </Typography>
          ) : (
            <Box />
          )}
          {showCloseButton ? (
            <IconButton
              aria-label={title ? `Close ${title}` : 'Close sheet'}
              onClick={onClose}
              sx={{
                color: colors.onSurfaceVariant,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          ) : null}
        </Stack>
      ) : null}

      {children}
    </Stack>
  )
}
