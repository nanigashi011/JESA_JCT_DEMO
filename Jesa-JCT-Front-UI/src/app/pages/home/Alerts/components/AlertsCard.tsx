import { FC, useState } from 'react'
import { useAlerts } from '../hooks/useAlerts'
import { AlertItem } from './AlertItem'
import { KTIcon } from '@/_metronic/helpers'

const AlertsCard: FC = () => {
  const { alerts, loading } = useAlerts()
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemsPerPage = 3
  const maxIndex = Math.max(0, alerts.length - itemsPerPage)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  if (loading) {
    return (
      <div className='card custom-card'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  const visibleAlerts = alerts.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <div className='col-12'>
      <div className='card custom-card'>
        <div className='card-header pt-3 pb-3'>
          <h3 className='card-title'>
            <span className='card-label fw-bold text-gray-900'>
              Alerts{' '}
              <span className='badge badge-light-danger badge-circle ms-2 fs-7'>
                {alerts.length}
              </span>
            </span>
          </h3>

          <div className='card-toolbar m-0'>
            <div className='d-flex align-items-center gap-2'>
              <button
                className='btn btn-sm btn-icon btn-circle btn-outline'
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <KTIcon iconName='left' className='fs-4' />
              </button>
              <button
                className='btn btn-sm btn-icon btn-circle btn-outline'
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <KTIcon iconName='right' className='fs-4' />
              </button>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <div className='row'>
            {visibleAlerts.map((alert) => (
              <div key={alert.id} className='col-lg-4 col-md-6 col-12 mb-3'>
                <AlertItem alert={alert} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AlertsCard }
