import { useEffect } from 'react'
import { useOutletContext } from 'react-router'

export type AppShellLeadingAction = {
  ariaLabel: string
  icon: 'back'
  onClick: () => void
}

export type AppShellHeader = {
  contentPaddingBottom?: string
  leadingAction?: AppShellLeadingAction
  hideBottomNavigation?: boolean
  rightText?: string
  title: string
}

export type AppShellOutletContext = {
  setBottomNavigationVisible: (visible: boolean) => void
  setHeader: (header: Omit<AppShellHeader, 'hideBottomNavigation'>) => void
}

export function useAuthenticatedHeader(header: AppShellHeader) {
  const { setBottomNavigationVisible, setHeader } =
    useOutletContext<AppShellOutletContext>()
  const { contentPaddingBottom, hideBottomNavigation = false, leadingAction, rightText, title } =
    header

  useEffect(() => {
    setHeader({ contentPaddingBottom, leadingAction, rightText, title })
  }, [contentPaddingBottom, leadingAction, rightText, setHeader, title])

  useEffect(() => {
    setBottomNavigationVisible(!hideBottomNavigation)
  }, [hideBottomNavigation, setBottomNavigationVisible])
}
