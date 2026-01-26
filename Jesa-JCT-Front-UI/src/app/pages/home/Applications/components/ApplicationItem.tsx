import { FC } from 'react'
import { Application } from '../../types'

interface ApplicationItemProps {
  application: Application
}

const ApplicationItem: FC<ApplicationItemProps> = ({ application }) => {
  return (
    <div className='col-6'>
      <div className='card p-3 mb-4'>
        <a href='#0'>
          <div className='d-flex justify-content-between align-items-center w-100'>
            <div className='d-flex justify-content-start align-items-center'>
              <div className='symbol border symbol-45px me-4'>
                <img src={application.icon} alt={application.name} />
              </div>
              <div className='fw-bold fs-4 text-gray-900'>{application.name}</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

export { ApplicationItem }
