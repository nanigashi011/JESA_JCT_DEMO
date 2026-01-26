import { FC } from 'react'
import { Alert } from '../../types'
import clsx from 'clsx'

interface AlertItemProps {
  alert: Alert
}

const AlertItem: FC<AlertItemProps> = ({ alert }) => {
  const getIconColorClass = () => {
    if (alert.type === 'danger') return 'text-danger'
    if (alert.type === 'warning') return 'text-warning'
    if (alert.type === 'success') return 'text-success'
    return 'text-info'
  }

  return (
    <div className='card custom-card alert-main-card primary h-100'>
      <div className='card-body'>
          <div className='d-block w-100'>
            <div className='d-flex justify-content-between w-100 mb-1'>
              <div className='fw-bold fs-7 text-gray-900'>
                <i
                  className={clsx(
                    'flaticon-siren-1 fs-3 me-1 position-relative',
                    getIconColorClass()
                  )}
                  style={{ top: '2px' }}
                ></i>
                {alert.title}
              </div>
              <div className='d-flex justify-content-end'>
                <div className='fs-7 border rounded-2 px-2 py-0 text-gray-600'>
                  <i
                    className='flaticon-calendar-2 fs-5 position-relative'
                    style={{ top: '2px' }}
                  ></i>{' '}
                  Reporting :{' '}
                  <span className='fs-7 text-gray-900 fw-bold'>
                    {alert.reportingDate}
                  </span>
                </div>
                {alert.hasTeams && (
                  <div className='fs-7 border border-success rounded-2 px-2 py-0 text-success ms-1'>
                    <i
                      className='flaticon-meeting-room fs-5 position-relative'
                      style={{ top: '2px' }}
                    ></i>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className='fs-7 py-0 text-gray-600'>
                <i
                  className='flaticon-rocket fs-5 position-relative'
                  style={{ top: '2px' }}
                ></i>{' '}
                Project :{' '}
                <span className='fs-7 text-gray-900 fw-bold'>
                  {alert.projectName}
                </span>
              </div>
            </div>

            <div className='d-flex justify-content-between w-100'>
              {/* Impacted Activities */}
              {alert.impactedActivities !== undefined && (
                <div className='d-flex flex-column align-items-center'>
                  <div className='fs-7 text-gray-600'>
                    <i
                      className='flaticon-meteor position-relative fs-5'
                      style={{ top: '2px' }}
                    ></i>{' '}
                    Impacted Ac.
                  </div>
                  <div className='fs-6 text-gray-900 fw-semibold'>
                    {alert.impactedActivities}
                  </div>
                </div>
              )}

              {/* Baseline */}
              {alert.baseline && (
                <div className='d-flex flex-column align-items-center'>
                  <div className='fs-7 text-gray-600'>
                    <i
                      className='flaticon-calendar-2 position-relative fs-5'
                      style={{ top: '2px' }}
                    ></i>{' '}
                    Baseline
                  </div>
                  <div className='fs-7 text-gray-900 fw-semibold'>
                    {alert.baseline}
                  </div>
                </div>
              )}

              {/* Forecast */}
              {alert.forecast && (
                <div className='d-flex flex-column align-items-center'>
                  <div className='fs-7 text-gray-600'>
                    <i
                      className='flaticon-calendar-2 position-relative fs-5'
                      style={{ top: '2px' }}
                    ></i>{' '}
                    Forecast
                  </div>
                  <div className='fs-7 text-gray-900 fw-semibold'>
                    {alert.forecast}
                  </div>
                </div>
              )}

              {/* Days Delay */}
              {alert.daysDelay && (
                <div className='d-flex flex-column align-items-center'>
                  <div className='fs-7 text-gray-600'>
                    <i
                      className='flaticon-hourglass position-relative fs-5'
                      style={{ top: '2px' }}
                    ></i>{' '}
                    Days
                  </div>
                  <div className='fs-6 badge badge-light-danger fw-semibold'>
                    {alert.daysDelay}
                  </div>
                </div>
              )}

              {/* WPS Image */}
              {alert.wpsImage && (
                <div className='d-flex flex-column align-items-center'>
                  <div className='fs-7 text-gray-600'>
                    <i
                      className='flaticon-speedometer-1 position-relative fs-5 me-1'
                      style={{ top: '2px' }}
                    ></i>{' '}
                    WPS
                  </div>
                  <div>
                    <img src={alert.wpsImage} width='80' alt='WPS' />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export { AlertItem }
