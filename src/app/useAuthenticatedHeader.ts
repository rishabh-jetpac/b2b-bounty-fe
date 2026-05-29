import { useEffect } from 'react'
import { useOutletContext } from 'react-router'

export type AppShellLeadingAction = {
  ariaLabel: string
  icon: 'back'
  onClick: () => void
}

export type AppShellHeader = {
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
  const { hideBottomNavigation = false, leadingAction, rightText, title } = header

  useEffect(() => {
    setHeader({ leadingAction, rightText, title })
  }, [leadingAction, rightText, setHeader, title])

  useEffect(() => {
    setBottomNavigationVisible(!hideBottomNavigation)
  }, [hideBottomNavigation, setBottomNavigationVisible])
}
