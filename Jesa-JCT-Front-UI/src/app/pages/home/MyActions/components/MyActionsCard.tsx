import { FC } from 'react'
import { useMyActions } from '../hooks/useMyActions'
import { ActionItem } from './ActionItem'
import { Link } from 'react-router-dom'

const MyActionsCard: FC = () => {
  const { actions, loading } = useMyActions()

  if (loading) {
    return (
      <div className='card flex-grow-1'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  const pendingActions = actions.filter((a) => a.status !== 'completed')

  return (
    <div className='card flex-grow-1'>
      <div className='card-header pt-3 pb-3'>
        <h3 className='card-title'>
          <Link to='/my-actions'>
            <span className='card-label fw-bold text-gray-900'>
              My Actions{' '}
              <span className='badge badge-light-danger badge-circle ms-2 fs-7'>
                {pendingActions.length}
              </span>
            </span>
          </Link>
        </h3>

        <div className='card-toolbar m-0'>
          <a
            href='#0'
            className='btn btn-sm btn-outline text-gray-500 border-gray-500 me-3'
            data-bs-toggle='modal'
            data-bs-target='#addActionModal'
          >
            + Add
          </a>
          <button
            className='btn btn-sm btn-outline text-gray-500 border-gray-500 px-3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-overflow='true'
          >
            <i className='flaticon-sort p-0 fs-4'></i>
          </button>
          {/* Filter menu would go here */}
          <a href='#' className='btn btn-icon btn-hover-light-primary draggable-handle'>
            <i className='ki-duotone ki-abstract-14 fs-2x'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
          </a>
        </div>
      </div>

      <div className='card-body'>
        <div className='hover-scroll-y h-350px p-2'>
          {pendingActions.map((action) => (
            <ActionItem key={action.id} action={action} />
          ))}
        </div>
      </div>
    </div>
  )
}

export { MyActionsCard }
