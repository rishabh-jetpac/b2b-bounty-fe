import { useEffect } from 'react'
import { useOutletContext } from 'react-router'

type AppShellHeader = {
  hideBottomNavigation?: boolean
  rightText?: string
  title: string
}

type AppShellOutletContext = {
  setBottomNavigationVisible: (visible: boolean) => void
  setHeader: (header: AppShellHeader) => void
}

export function useAuthenticatedHeader(header: AppShellHeader) {
  const { setBottomNavigationVisible, setHeader } =
    useOutletContext<AppShellOutletContext>()
  const { hideBottomNavigation = false, rightText, title } = header

  useEffect(() => {
    setHeader({ rightText, title })
  }, [rightText, setHeader, title])

  useEffect(() => {
    setBottomNavigationVisible(!hideBottomNavigation)
  }, [hideBottomNavigation, setBottomNavigationVisible])
}
