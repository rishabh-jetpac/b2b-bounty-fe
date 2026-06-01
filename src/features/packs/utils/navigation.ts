import type { NavigateFunction, To } from 'react-router'

type HistoryState = {
  idx?: number
}

export function canNavigateBack() {
  if (typeof window === 'undefined') {
    return false
  }

  const historyState = window.history.state as HistoryState | null

  if (typeof historyState?.idx === 'number') {
    return historyState.idx > 0
  }

  return window.history.length > 1
}

export function navigateBackOrTo(navigate: NavigateFunction, fallbackTo: To) {
  if (canNavigateBack()) {
    navigate(-1)
    return
  }

  navigate(fallbackTo)
}
