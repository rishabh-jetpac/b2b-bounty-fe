import { BASE_URL } from '../../../../contants'
import { apiClient } from '../../../lib/api/client'
import type { RevampDestinationApiItem, RevampDestinationDirectoryResponse } from '../apiTypes'
import type { Destination } from '../types'
import { prettifyDestinationPageName } from '../utils/destinationFormatting'

const REVAMP_DESTINATIONS_ENDPOINT =
  `${BASE_URL}/catalog/revamp/destinations`

export async function getDestinations() {
  const response = await apiClient.get<RevampDestinationDirectoryResponse>(
    REVAMP_DESTINATIONS_ENDPOINT,
  )
  const destinations = new Map<string, Destination>()

  for (const rawDestination of response.data.data.allPacks) {
    const destination = mapDestination(rawDestination)
    destinations.set(destination.pageName, destination)
  }

  return Array.from(destinations.values())
}

function mapDestination(rawDestination: RevampDestinationApiItem): Destination {
  const pageName = rawDestination.pageName.trim()
  const displayName = rawDestination.displayName.trim() || prettifyDestinationPageName(pageName)

  return {
    displayName,
    pageName,
  } satisfies Destination
}
