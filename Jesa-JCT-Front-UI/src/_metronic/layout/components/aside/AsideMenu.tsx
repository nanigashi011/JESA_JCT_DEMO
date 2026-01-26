import {useRef, useEffect, FC} from 'react'
import {useLocation} from 'react-router'
import clsx from 'clsx'
import {AsideMenuMain} from './AsideMenuMain'
import {DrawerComponent, ScrollComponent, ToggleComponent} from '../../../assets/ts/components'

type Props = {
  asideMenuCSSClasses: string[]
}

const AsideMenu: FC<Props> = ({asideMenuCSSClasses}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {pathname} = useLocation()

  useEffect(() => {
    setTimeout(() => {
      DrawerComponent.reinitialization()
      ToggleComponent.reinitialization()
      ScrollComponent.reinitialization()
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    }, 50)
     
  }, [pathname])

  return (
    <div
      id='kt_app_sidebar_menu'
      ref={scrollRef}
      data-kt-menu='true'
      className={clsx(
        'menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6',
        asideMenuCSSClasses.join(' ')
      )}
    >
      <AsideMenuMain />
    </div>
  )
}

export {AsideMenu}
