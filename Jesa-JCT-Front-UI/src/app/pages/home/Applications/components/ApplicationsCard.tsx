import { FC, useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { ApplicationItem } from './ApplicationItem'

const ApplicationsCard: FC = () => {
  const { applications, loading, toggleApplication } = useApplications()
  const [showMenu, setShowMenu] = useState(false)

  if (loading) {
    return (
      <div className='card flex-grow-1'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  const enabledApps = applications.filter((app) => app.enabled)

  return (
    <div className='card flex-grow-1'>
      <div className='card-header pt-3 pb-3'>
        <h3 className='card-title'>
          <span className='card-label fw-bold text-gray-900'>Applications</span>
        </h3>
        <div className='card-toolbar m-0'>
          <a href='#' className='btn btn-icon btn-hover-light-primary draggable-handle'>
            <i className='ki-duotone ki-abstract-14 fs-2x'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
          </a>
        </div>
      </div>
      <div className='card-body'>
        <div className='hover-scroll-y h-350px p-2' style={{ overflowX: 'hidden' }}>
          <div className='d-flex justify-content-end'>
            <button
              className='btn btn-color-gray-500 btn-active-color-primary p-0 mb-3'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-overflow='true'
              onClick={() => setShowMenu(!showMenu)}
            >
              <i className='ki-duotone ki-dots-square fs-1 text-gray-500 me-n1'>
                <span className='path1'></span>
                <span className='path2'></span>
                <span className='path3'></span>
                <span className='path4'></span>
              </i>
            </button>
            {/* Filter menu would go here */}
          </div>
          <div className='row'>
            {enabledApps.map((app) => (
              <ApplicationItem key={app.id} application={app} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ApplicationsCard }
