import { FC } from 'react'
import { KPIData } from '../../types'
import clsx from 'clsx'

interface KPISlideProps {
  kpi: KPIData
}

const KPISlide: FC<KPISlideProps> = ({ kpi }) => {
  const getValueColorClass = () => {
    if (kpi.title === 'Progress') return 'text-success'
    if (kpi.title === 'SOP Date') return 'text-warning'
    return 'text-primary'
  }

  return (
    <div className='col-12 item-kpi'>
      <div className='d-flex gap-3'>
        <div className='symbol symbol-30px me-1'>
          <span className='symbol-label border text-primary fw-bold fs-3'>
            <i className={clsx(kpi.icon, 'mt-2')}></i>
          </span>
        </div>
        <div className='d-flex align-items-top w-100'>
          <div>
            <p className='fw-medium m-0 fs-3 text-gray-900'>{kpi.title}</p>
            {kpi.value && (
              <h4 className={clsx('fw-bold m-0 size-kpi', getValueColorClass())}>
                {kpi.value}{' '}
                {kpi.subtitle && (
                  <span className='fs-4 fw-semibold text-gray-500'>
                    {kpi.subtitle}
                  </span>
                )}
              </h4>
            )}
          </div>
        </div>
        {kpi.type === 'progress' && kpi.chartData && (
          <div id='lineWidget' className='w-100 ps-3 pe-6'></div>
        )}
      </div>

      {kpi.additionalInfo && (
        <div className='d-flex text-center justify-content-between mt-12'>
          {kpi.additionalInfo.map((info, index) => (
            <div key={index} className='fs-3 fw-normal text-gray-700'>
              <p className='fw-bold m-0 text-gray-900'>{info.value}</p>
              <span className='fs-5'>{info.label}</span>
            </div>
          ))}
        </div>
      )}

      {kpi.type === 'progress' && (
        <div className='d-flex text-center justify-content-center mt-5 gap-8'>
          <div className='fs-4 fw-semibold text-gray-500'>
            <span className='text-gray-700'>
              <span className='text-primary'>●</span> Planned
            </span>
          </div>
          <div className='fs-4 fw-semibold text-gray-500'>
            <span className='text-gray-700'>
              <span className='text-success'>●</span> Actual
            </span>
          </div>
        </div>
      )}

      {kpi.type === 'chart' && kpi.chartData && (
        <div className='' style={{ marginTop: '-50px' }}>
          <div id='bar_chart_widget'></div>
        </div>
      )}
    </div>
  )
}

export { KPISlide }
