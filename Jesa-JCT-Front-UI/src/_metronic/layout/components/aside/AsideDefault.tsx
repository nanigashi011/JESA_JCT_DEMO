

import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLayout} from '../../core'
import {AsideMenu} from './AsideMenu'

const AsideDefault: FC = () => {
  const {config, classes} = useLayout()
  const {aside} = config

  return (
    <div
      id='kt_app_sidebar'
      className={clsx('app-sidebar flex-column', classes.aside.join(' '), {'d-none': !aside.display})}
      data-kt-drawer='true'
      data-kt-drawer-name='app-sidebar'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width='225px'
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_app_sidebar_mobile_toggle'
    >
      {/* begin::Logo */}
      <div className='app-sidebar-logo px-6' id='kt_app_sidebar_logo'>
        <Link to='/dashboard'>
          <img
            alt='Logo'
            src='/media/logos/logo-jct-b.png'
            className='h-45px app-sidebar-logo-default'
          />
          <img
            alt='Logo'
            src='/media/logos/logo-jct-s.png'
            className='h-40px app-sidebar-logo-minimize'
          />
        </Link>
      </div>
      {/* end::Logo */}

      {/* begin::sidebar menu */}
      <div className='app-sidebar-menu overflow-hidden flex-column-fluid sidebar-1'>
        <div id='kt_app_sidebar_menu_wrapper' className='app-sidebar-wrapper'>
          <div 
            id='kt_app_sidebar_menu_scroll' 
            className='scroll-y my-5 ms-5 me-3' 
            data-kt-scroll='true'
            data-kt-scroll-activate='true' 
            data-kt-scroll-height='auto'
            data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
            data-kt-scroll-wrappers='#kt_app_sidebar_menu' 
            data-kt-scroll-offset='5px'
            data-kt-scroll-save-state='true'
          >
            <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
          </div>
        </div>
      </div>
      {/* end::sidebar menu */}

      {/* begin::Footer */}
      <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 ps-5' id='kt_app_sidebar_footer'>
        <a
          href='#0'
          className='btn btn-flex flex-center border-primary text-primary btn-custom overflow-hidden text-nowrap px-0 w-100 mb-4'
          data-bs-placement='top'
          data-bs-trigger='hover'
          data-bs-dismiss-='click'
          title='AI Agent Assistant'
        >
          <i className='flaticon-robot-1 text-primary fs-1 mt-1 pe-0'></i>
          <span className='btn-label text-primary ms-2'>Agent AI</span>
        </a>
      </div>
      {/* end::Footer */}
    </div>
  )
}

export {AsideDefault}
