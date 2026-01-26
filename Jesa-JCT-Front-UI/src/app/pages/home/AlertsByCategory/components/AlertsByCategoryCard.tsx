import { FC, useEffect, useRef } from 'react'
import { useAlertsByCategory } from '../hooks/useAlertsByCategory'

const AlertsByCategoryCard: FC = () => {
  const { chartData, loading } = useAlertsByCategory()
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current && chartData) {
      // Initialize ApexCharts here if needed
      // For now, this is a static component
    }
  }, [chartData])

  if (loading) {
    return (
      <div className='card flex-grow-1'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  return (
    <div className='card flex-grow-1'>
      <div className='card-header pt-3 pb-3'>
        <h3 className='card-title'>
          <span className='card-label fw-bold text-gray-900'>Alerts by Category</span>
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
        <div id='alert-category' ref={chartRef} style={{ height: '350px' }}></div>
      </div>
    </div>
  )
}

export { AlertsByCategoryCard }
