import type { DestinationPackSection } from '../types'

export const ALL_DESTINATION_PACKS_FILTER = 'all'

export type DestinationPackFilterOption = {
  key: string
  label: string
}

export function buildDestinationPackFilterOptions(
  sections: DestinationPackSection[],
): DestinationPackFilterOption[] {
  return [
    { key: ALL_DESTINATION_PACKS_FILTER, label: 'All' },
    ...sections.map((section) => ({
      key: getDestinationPackSectionFilterKey(section),
      label: section.title,
    })),
  ]
}

export function getActiveDestinationPackFilter(
  selectedFilter: string,
  filterOptions: DestinationPackFilterOption[],
) {
  return filterOptions.some((filterOption) => filterOption.key === selectedFilter)
    ? selectedFilter
    : ALL_DESTINATION_PACKS_FILTER
}

export function filterDestinationPackSections(
  sections: DestinationPackSection[],
  activeFilter: string,
) {
  if (activeFilter === ALL_DESTINATION_PACKS_FILTER) {
    return sections
  }

  return sections.filter(
    (section) => getDestinationPackSectionFilterKey(section) === activeFilter,
  )
}

export function getDestinationPackSectionFilterKey(section: DestinationPackSection) {
  return section.kind === 'unlimited' ? 'unlimited' : `days:${section.validityInDays}`
}
