import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
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
import { useAuthenticatedHeader } from '../../../app/useAuthenticatedHeader'
import { PullToRefreshContainer } from '../../../components/PullToRefreshContainer'
import { colors } from '../../../colors'
import { getApiErrorMessage } from '../../../lib/api/errors'
import {
  formatInventoryDate,
  formatInventoryRecency,
} from '../utils/inventoryFormatting'
import {
  filterInventoryItems,
  filterInventoryPackGroups,
  getAssignedInventory,
  getFailedInventory,
  getGroupedUnassignedInventory,
  getInventoryCounts,
} from '../utils/inventorySelectors'
import { useInventoryQuery } from '../hooks/useInventoryQuery'
import { ReassignmentModal } from '../components/ReassignmentModal'
import type { InventoryItem, InventoryPackGroup, InventoryTab } from '../types'

const searchPlaceholderByTab: Record<InventoryTab, string> = {
  unassigned: 'Search by pack',
  assigned: 'Search by email or pack',
  failed: 'Search by email or pack',
}

const inventoryActionButtonSx = {
  minWidth: 0,
  minHeight: 28,
  px: 1.6,
  py: 0.05,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  border: `1px solid ${colors.primary}`,
  color: colors.primary,
  fontSize: '0.92rem',
  fontWeight: 500,
  lineHeight: 1.2,
  textTransform: 'none',
  flexShrink: 0,
} as const

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
            <Stack spacing={1}>
              <Tabs
                onChange={(_event, value: InventoryTab) => setActiveTab(value)}
                sx={{
                  minHeight: 0,
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colors.surfaceContainerLowest,
                  },
                }}
                value={searchQuery}
              />
            </Stack>

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
                title="Assigned Packs"
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
        title="Unassigned Packs"
      />

      <Stack spacing={1.25}>
        {groups.map((group) => (
          <Paper
            key={`${group.packId}:${group.packName}`}
            elevation={0}
            sx={{
              borderRadius: '8px',
              border: `1px solid ${colors.outlineVariant}`,
              px: 1.75,
              py: 1.35,
              backgroundColor: colors.surfaceContainerLowest,
              boxShadow: `0 10px 20px ${alpha(colors.primary, 0.05)}`,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    color: colors.onSurface,
                    fontSize: { xs: '1.2rem', sm: '1.32rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {group.packName}
                </Typography>
                <Typography
                  sx={{
                    color: colors.primaryContainer,
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {`Available: ${group.quantity}`}
                </Typography>
              </Stack>

              <Button
                onClick={() => onAssign(group.packId)}
                sx={{
                  ...inventoryActionButtonSx,
                  '&:hover': {
                    border: `1px solid ${colors.primary}`,
                    backgroundColor: alpha(colors.primary, 0.04),
                    color: colors.primary,
                  },
                }}
                variant="text"
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
  readOnly,
  title,
}: InventoryHistorySectionProps) {
  if (items.length === 0) {
    return <StateCard description={emptyDescription} title={emptyTitle} />
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeader
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
                      {item.status === 'assigned'
                        ? formatInventoryDate(item)
                        : formatInventoryRecency(item)}
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
                <Box component="span" sx={inventoryActionButtonSx}>
                  Reassign
                </Box>
              )}
            </Stack>
          )

          return (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: '8px',
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
  description?: string
  title: string
}

function SectionHeader({ description, title }: SectionHeaderProps) {
  return (
    <Stack spacing={0.35}>
      <Typography
        variant="h2"
        sx={{
          color: colors.onSurface,
          fontSize: { xs: '1.25rem', sm: '1.35rem' },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {description &&
      <Typography
        sx={{
          color: colors.onSurfaceVariant,
          fontSize: '0.92rem',
          lineHeight: 1.45,
        }}
      >
        {description}
      </Typography>}
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
  borderRadius: '8px',
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
