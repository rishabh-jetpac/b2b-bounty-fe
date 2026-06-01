import type { ReactNode } from 'react'
import { alpha } from '@mui/material/styles'
import { Box, Container, Divider, Link as MuiLink, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'
import { colors } from '../../../colors'
import jetpacLogo from '../../../assets/images/jetpac_new_logo.png'

interface AuthLayoutProps {
  children: ReactNode
  footerLinkLabel?: string
  footerLinkPrefix?: string
  footerLinkTo?: string
}

export function AuthLayout({
  children,
  footerLinkLabel,
  footerLinkPrefix,
  footerLinkTo,
}: AuthLayoutProps) {
  const footerLink =
    footerLinkLabel && footerLinkPrefix && footerLinkTo
      ? {
          label: footerLinkLabel,
          prefix: footerLinkPrefix,
          to: footerLinkTo,
        }
      : null

  return (
    <Box
      sx={{
        minHeight: '100svh',
        position: 'relative',
        backgroundColor: colors.background,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 8, sm: 10 },
        }}
      >
        <Stack
          spacing={{ xs: 5.5, sm: 6.5 }}
          sx={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={jetpacLogo}
            alt="Jetpac"
            sx={{
              width: { xs: 210, sm: 260 },
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
            }}
          />

          <Paper
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: 2,
              border: `1px solid ${colors.outlineVariant}`,
              backgroundColor: colors.surfaceContainerLowest,
              boxShadow: `0 18px 44px ${alpha(colors.primary, 0.08)}`,
            }}
          >
            <Stack spacing={4} sx={{ p: { xs: 3, sm: 4 } }}>
              {children}

              {footerLink ? (
                <>
                  <Divider sx={{ borderColor: colors.outlineVariant }} />

                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.onSurfaceVariant,
                      textAlign: 'center',
                    }}
                  >
                    {footerLink.prefix}{' '}
                    <MuiLink
                      component={RouterLink}
                      to={footerLink.to}
                      underline="hover"
                      sx={{
                        color: colors.primaryContainer,
                        fontWeight: 700,
                        textUnderlineOffset: '0.2em',
                      }}
                    >
                      {footerLink.label}
                    </MuiLink>
                  </Typography>
                </>
              ) : null}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
