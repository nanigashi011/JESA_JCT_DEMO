import { FC } from 'react'
import { Action } from '../../types'
import clsx from 'clsx'
import { KTIcon } from '@/_metronic/helpers'

interface ActionItemProps {
  action: Action
}

const ActionItem: FC<ActionItemProps> = ({ action }) => {
  const getPriorityClass = () => {
    if (action.priority === 'high') return 'danger'
    if (action.priority === 'medium') return 'warning'
    return 'success'
  }

  const priorityClass = getPriorityClass()
  
  // Calculate days between dates
  const startDate = new Date(action.dueDate)
  const endDate = new Date(action.dueDate)
  endDate.setDate(endDate.getDate() + (action.priority === 'high' ? 6 : action.priority === 'medium' ? 17 : 25))
  
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className={clsx('card px-5 py-4 mb-4', `card-ar-${action.priority}`)}>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-stretch'>
        <div className='d-flex flex-column justify-content-between flex-grow-1'>
          <div className='d-flex align-items-center justify-content-between gap-2'>
            <div>
              <KTIcon
                iconName='siren-1'
                className={clsx(`text-${priorityClass}`, 'me-1 fs-4 position-relative top-2px')}
              />
              <span className='fw-bold'>{action.title}</span>
            </div>
            <span className='badge badge-light-primary fs-8'>{action.category}</span>
          </div>

          <div className='mt-2'>
            <KTIcon iconName='user-2' className='fs-4 me-1 position-relative top-2px' />
            <span className='text-gray-800'>From :</span>{' '}
            <span className='fw-semibold fs-6'>{action.assignedTo || 'My self'}</span>
          </div>

          <div
            className='text-gray-800 fs-6 d-flex fw-semibold align-items-center mt-2'
            title={action.description}
          >
            <KTIcon iconName='information-5' className='fs-5 me-2 position-relative top-2px' />
            {action.description.length > 60
              ? `${action.description.substring(0, 60)}...`
              : action.description}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='separator my-3'></div>

      {/* Footer */}
      <div className='d-flex justify-content-between align-items-center'>
        {/* Dates */}
        <div className='d-flex align-items-center gap-3 fs-7 text-gray-600'>
          <KTIcon iconName='calendar-2' className='position-relative top-2px fs-5' />
          <span>
            {formatDate(startDate)} → {formatDate(endDate)}
          </span>
        </div>

        {/* Days */}
        <div className={clsx('badge fw-bold', `badge-light-${priorityClass}`)}>
          {days} <span className='fs-8 ms-1'>Days</span>
        </div>

        {/* Actions */}
        <div className='d-flex gap-2'>
          {action.priority === 'low' ? (
            <a
              href='#'
              className='btn btn-sm btn-outline border-success d-flex fw-medium text-success'
              data-bs-target='#validationActionModal'
              data-bs-toggle='modal'
            >
              Validation Action
            </a>
          ) : (
            <>
              <a
                href='#'
                className='btn btn-sm btn-outline border-gray-600 d-flex fw-medium text-gray-600'
                data-bs-target='#requestInfoModal'
                data-bs-toggle='modal'
              >
                Request info
              </a>
              <a
                href='#'
                className='btn btn-sm btn-outline border-primary d-flex fw-medium text-primary'
                data-bs-target='#takeActionModal'
                data-bs-toggle='modal'
              >
                Take Action
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { ActionItem }
