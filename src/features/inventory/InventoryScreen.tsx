import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthenticatedHeader } from '../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../components/PullToRefreshContainer'
import { colors } from '../../colors'
import { getApiErrorMessage } from '../../lib/api/errors'
import { formatInventoryRecency } from './inventoryFormatting'
import {
  filterInventoryItems,
  filterInventoryPackGroups,
  getAssignedInventory,
  getFailedInventory,
  getGroupedUnassignedInventory,
  getInventoryCounts,
} from './inventorySelectors'
import { useInventoryQuery } from './hooks/useInventoryQuery'
import { ReassignmentModal } from './ReassignmentModal'
import type { InventoryItem, InventoryPackGroup, InventoryTab } from './types'

const searchPlaceholderByTab: Record<InventoryTab, string> = {
  unassigned: 'Search by pack',
  assigned: 'Search by email or pack',
  failed: 'Search by email or pack',
}

export function InventoryScreen() {
  const navigate = useNavigate()
  const inventoryQuery = useInventoryQuery()
  const [activeTab, setActiveTab] = useState<InventoryTab>('unassigned')
  const [searchQuery, setSearchQuery] = useState('')
  const [reassignmentItem, setReassignmentItem] = useState<InventoryItem | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  useAuthenticatedHeader({
    title: 'Inventory',
  })

  const inventory = inventoryQuery.data ?? []
  const counts = getInventoryCounts(inventory)
  const unassignedGroups = filterInventoryPackGroups(
    getGroupedUnassignedInventory(inventory),
    searchQuery,
  )
  const assignedItems = filterInventoryItems(getAssignedInventory(inventory), searchQuery)
  const failedItems = filterInventoryItems(getFailedInventory(inventory), searchQuery)

  async function handleRefresh() {
    await inventoryQuery.refetch()
  }

  if (inventoryQuery.isPending) {
    return <LoadingState />
  }

  if (inventoryQuery.isError && inventory.length === 0) {
    return (
      <PullToRefreshContainer onRefresh={handleRefresh}>
        <StateCard
          action={
            <Button
              onClick={() => {
                void handleRefresh()
              }}
              sx={stateActionButtonSx}
              variant="contained"
            >
              Retry
            </Button>
          }
          description={getApiErrorMessage(
            inventoryQuery.error,
            'We could not load inventory right now. Please try again.',
          )}
          title="We could not load inventory"
        />
      </PullToRefreshContainer>
    )
  }

  return (
    <>
      <PullToRefreshContainer
        isPullable={reassignmentItem === null}
        onRefresh={handleRefresh}
      >
        <Box>
          <Stack spacing={2.25}>
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: '20px',
                border: `1px solid ${colors.outlineVariant}`,
                backgroundColor: colors.surfaceContainerLowest,
                boxShadow: `0 18px 36px ${alpha(colors.primary, 0.08)}`,
              }}
            >
              <Tabs
                onChange={(_event, value: InventoryTab) => setActiveTab(value)}
                sx={{
                  minHeight: 0,
                  borderBottom: `1px solid ${colors.outlineVariant}`,
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 999,
                    backgroundColor: colors.primaryContainer,
                  },
                }}
                value={activeTab}
                variant="fullWidth"
              >
                <Tab
                  disableRipple
                  label={<TabLabel count={counts.unassigned} label="Unassigned" />}
                  sx={tabSx}
                  value="unassigned"
                />
                <Tab
                  disableRipple
                  label={<TabLabel count={counts.assigned} label="Assigned" />}
                  sx={tabSx}
                  value="assigned"
                />
                <Tab
                  disableRipple
                  label={<TabLabel count={counts.failed} label="Failed" />}
                  sx={tabSx}
                  value="failed"
                />
              </Tabs>

              <Box sx={{ px: 2, py: 2 }}>
                <TextField
                  fullWidth
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholderByTab[activeTab]}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear inventory search"
                            edge="end"
                            onClick={() => setSearchQuery('')}
                            sx={{ color: colors.outline }}
                          >
                            <CloseRoundedIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                  value={searchQuery}
                />
              </Box>
            </Paper>

            {activeTab === 'unassigned' ? (
              <UnassignedSection
                groups={unassignedGroups}
                onAssign={(packId) => navigate(`/inventory/assign/${packId}`)}
                query={searchQuery}
              />
            ) : null}

            {activeTab === 'assigned' ? (
              <InventoryHistorySection
                emptyDescription={
                  searchQuery
                    ? 'Try a different email address or pack name.'
                    : 'Assigned inventory will appear here once packs are distributed.'
                }
                emptyTitle={
                  searchQuery ? 'No assigned inventory matches this search' : 'No assigned inventory yet'
                }
                items={assignedItems}
                onSelectItem={setReassignmentItem}
                query={searchQuery}
                readOnly={false}
                title="Assigned Inventory"
              />
            ) : null}

            {activeTab === 'failed' ? (
              <InventoryHistorySection
                emptyDescription={
                  searchQuery
                    ? 'Try a different email address or pack name.'
                    : 'Failed inventory events will appear here when the backend reports them.'
                }
                emptyTitle={
                  searchQuery ? 'No failed inventory matches this search' : 'No failed inventory'
                }
                items={failedItems}
                query={searchQuery}
                readOnly
                title="Failed Inventory"
              />
            ) : null}
          </Stack>
        </Box>
      </PullToRefreshContainer>

      <ReassignmentModal
        item={reassignmentItem}
        onClose={() => setReassignmentItem(null)}
        onSuccess={(message) => {
          setReassignmentItem(null)
          setFeedbackMessage(message)
        }}
        open={reassignmentItem !== null}
      />

      <Snackbar
        autoHideDuration={1800}
        onClose={() => setFeedbackMessage(null)}
        open={Boolean(feedbackMessage)}
      >
        <Alert severity="success" sx={{ width: '100%' }} variant="filled">
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

type UnassignedSectionProps = {
  groups: InventoryPackGroup[]
  onAssign: (packId: string) => void
  query: string
}

function UnassignedSection({ groups, onAssign, query }: UnassignedSectionProps) {
  if (groups.length === 0) {
    return (
      <StateCard
        description={
          query
            ? 'Try a different pack name.'
            : 'Unassigned inventory groups will appear here after purchases land in your inventory.'
        }
        title={query ? 'No unassigned packs match this search' : 'No unassigned inventory'}
      />
    )
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeader
        description="Group stock by pack and start assignment from here."
        title="Unassigned Packs"
      />

      <Stack spacing={1.25}>
        {groups.map((group) => (
          <Paper
            key={`${group.packId}:${group.packName}`}
            elevation={0}
            sx={{
              borderRadius: '18px',
              border: `1px solid ${colors.outlineVariant}`,
              px: 2,
              py: 2,
              backgroundColor: colors.surfaceContainerLowest,
              boxShadow: `0 14px 28px ${alpha(colors.primary, 0.06)}`,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${colors.primaryContainer} 0%, ${colors.primary} 100%)`,
                    color: colors.onPrimary,
                    flexShrink: 0,
                  }}
                >
                  <Inventory2RoundedIcon sx={{ fontSize: 30 }} />
                </Box>

                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: colors.onSurface,
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {group.packName}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.onSurfaceVariant,
                      fontSize: '0.92rem',
                      lineHeight: 1.4,
                    }}
                  >
                    Ready to assign
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: colors.outlineVariant,
                      }}
                    />
                    <Typography
                      sx={{
                        color: colors.primaryContainer,
                        fontSize: '0.92rem',
                        fontWeight: 700,
                      }}
                    >
                      {`Qty: ${group.quantity}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Button
                onClick={() => onAssign(group.packId)}
                sx={{
                  minWidth: { xs: '100%', sm: 132 },
                  backgroundColor: colors.primaryContainer,
                  '&:hover': {
                    backgroundColor: colors.primary,
                  },
                }}
                variant="contained"
              >
                Assign
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  )
}

type InventoryHistorySectionProps = {
  emptyDescription: string
  emptyTitle: string
  items: InventoryItem[]
  onSelectItem?: (item: InventoryItem) => void
  query: string
  readOnly: boolean
  title: string
}

function InventoryHistorySection({
  emptyDescription,
  emptyTitle,
  items,
  onSelectItem,
  query,
  readOnly,
  title,
}: InventoryHistorySectionProps) {
  if (items.length === 0) {
    return <StateCard description={emptyDescription} title={emptyTitle} />
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeader
        description={
          readOnly
            ? 'These rows are read-only in the first release.'
            : query
              ? 'Tap a row to reassign the selected inventory item.'
              : 'Tap any row to open reassignment.'
        }
        title={title}
      />

      <Stack spacing={1.1}>
        {items.map((item) => {
          const content = (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flex: 1 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    backgroundColor: readOnly
                      ? alpha(colors.errorContainer, 0.9)
                      : colors.primaryFixed,
                    color: readOnly ? colors.error : colors.primaryContainer,
                    flexShrink: 0,
                  }}
                >
                  {readOnly ? (
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 22 }} />
                  ) : (
                    <PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />
                  )}
                </Box>

                <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      color: colors.onSurface,
                      fontSize: '0.97rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.recipientEmail ?? 'Recipient unavailable'}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      rowGap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.onSurfaceVariant,
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.packName}
                    </Typography>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: colors.outlineVariant,
                      }}
                    />
                    <Typography
                      sx={{
                        color: colors.onSurfaceVariant,
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {formatInventoryRecency(item)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {readOnly ? (
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.55,
                    borderRadius: 999,
                    border: `1px solid ${alpha(colors.error, 0.28)}`,
                    backgroundColor: alpha(colors.errorContainer, 0.75),
                    color: colors.error,
                    fontFamily: '"Lexend", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    textTransform: 'uppercase',
                  }}
                >
                  Failed
                </Box>
              ) : (
                <ChevronRightRoundedIcon sx={{ color: colors.outline }} />
              )}
            </Stack>
          )

          return (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: '16px',
                border: `1px solid ${colors.outlineVariant}`,
                backgroundColor: colors.surfaceContainerLowest,
              }}
            >
              {readOnly ? (
                <Box sx={{ px: 2, py: 1.7 }}>{content}</Box>
              ) : (
                <Button
                  fullWidth
                  onClick={() => onSelectItem?.(item)}
                  sx={{
                    display: 'block',
                    px: 2,
                    py: 1.7,
                    textAlign: 'left',
                    color: 'inherit',
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: colors.surfaceContainerLow,
                      boxShadow: 'none',
                    },
                  }}
                  variant="text"
                >
                  {content}
                </Button>
              )}
            </Paper>
          )
        })}
      </Stack>
    </Stack>
  )
}

type SectionHeaderProps = {
  description: string
  title: string
}

function SectionHeader({ description, title }: SectionHeaderProps) {
  return (
    <Stack spacing={0.35}>
      <Typography
        variant="h2"
        sx={{
          color: colors.onSurface,
          fontSize: { xs: '1.55rem', sm: '1.7rem' },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: colors.onSurfaceVariant,
          fontSize: '0.92rem',
          lineHeight: 1.45,
        }}
      >
        {description}
      </Typography>
    </Stack>
  )
}

function LoadingState() {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack
        spacing={1.5}
        sx={{
          minHeight: 240,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={30} />
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          Loading inventory
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>
          Fetching the latest inventory activity for this account.
        </Typography>
      </Stack>
    </Paper>
  )
}

type StateCardProps = {
  action?: ReactNode
  description: string
  title: string
}

function StateCard({ action, description, title }: StateCardProps) {
  return (
    <Paper elevation={0} sx={stateCardSx}>
      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h3" sx={{ color: colors.onSurface }}>
          {title}
        </Typography>
        <Typography sx={{ color: colors.onSurfaceVariant }}>{description}</Typography>
        {action}
      </Stack>
    </Paper>
  )
}

type TabLabelProps = {
  count: number
  label: string
}

function TabLabel({ count, label }: TabLabelProps) {
  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
      <span>{label}</span>
      <Box
        component="span"
        sx={{
          minWidth: 24,
          px: 0.8,
          py: 0.2,
          borderRadius: 999,
          backgroundColor: colors.surfaceContainer,
          color: colors.primaryContainer,
          fontFamily: '"Lexend", sans-serif',
          fontSize: '0.78rem',
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        {count}
      </Box>
    </Stack>
  )
}

const tabSx = {
  minHeight: 54,
  color: colors.onSurfaceVariant,
  fontFamily: '"Lexend", sans-serif',
  fontSize: '0.92rem',
  fontWeight: 700,
  textTransform: 'none',
  '&.Mui-selected': {
    color: colors.primaryContainer,
  },
} as const

const stateCardSx = {
  borderRadius: '18px',
  border: `1px solid ${colors.outlineVariant}`,
  px: 2.25,
  py: 2.5,
  backgroundColor: colors.surfaceContainerLowest,
} as const

const stateActionButtonSx = {
  backgroundColor: colors.primaryContainer,
  '&:hover': {
    backgroundColor: colors.primary,
  },
} as const
