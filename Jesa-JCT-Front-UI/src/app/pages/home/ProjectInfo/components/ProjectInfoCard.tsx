import { FC } from 'react'
import { useProjectKPIs } from '../hooks/useProjectKPIs'
import { KPISlide } from './KPISlide'
import { KTIcon } from '@/_metronic/helpers'

const ProjectInfoCard: FC = () => {
  const { kpis, loading } = useProjectKPIs()

  if (loading) {
    return (
      <div className='card custom-card h-100'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  return (
    <div className='card custom-card h-100'>
      <div className='card-header pt-3 pb-3'>
        <h3 className='card-title'>
          <span className='card-label fw-bold text-gray-900'>Project Information</span>
        </h3>

        <div className='card-toolbar m-0'>
          <div id='kpi_controls' className='d-flex align-items-center gap-2'>
            <button className='btn btn-sm btn-icon btn-circle btn-outline btn-prev'>
              <KTIcon iconName='left' className='fs-4' />
            </button>
            <button className='btn btn-sm btn-icon btn-circle btn-outline btn-next'>
              <KTIcon iconName='right' className='fs-4' />
            </button>
          </div>
        </div>
      </div>

      <div className='card-body'>
        <div className='row'>
          <div className='tns tns-default' style={{ direction: 'ltr' }}>
            <div
              className='kpi-slider'
              data-tns='true'
              data-tns-loop='false'
              data-tns-slide-by='1'
              data-tns-swipe-angle='false'
              data-tns-speed='600'
              data-tns-autoplay='true'
              data-tns-autoplay-timeout='16000'
              data-tns-controls='true'
              data-tns-controls-container='#kpi_controls'
              data-tns-nav='false'
              data-tns-mouse-drag='true'
              data-tns-gutter='6'
              data-tns-items='1'
              data-tns-center='false'
              data-tns-dots='false'
            >
              {kpis.map((kpi) => (
                <KPISlide key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProjectInfoCard }
