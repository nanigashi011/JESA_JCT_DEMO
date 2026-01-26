import { FC } from 'react'
import { useKPIData } from '../hooks/useKPIData'
import { KPITickerItem } from './KPITickerItem'

const KPITickerBar: FC = () => {
  const { kpis, loading } = useKPIData()

  if (loading) {
    return (
      <div className='card custom-card hrm-main-card primary mb-2'>
        <div className='card-body text-center'>
          <span className='spinner-border spinner-border-sm'></span>
        </div>
      </div>
    )
  }

  return (
    <div className='card custom-card hrm-main-card primary mb-2'>
      <div className='card-body'>
        <div className='kpi-tickerbar'>
          {/* Duplicate items for smooth scrolling effect */}
          <div className='kpi-tickerbar__item'>
            {kpis.map((kpi) => (
              <KPITickerItem key={kpi.id} kpi={kpi} />
            ))}
          </div>
          <div className='kpi-tickerbar__item'>
            {kpis.map((kpi) => (
              <KPITickerItem key={`${kpi.id}-2`} kpi={kpi} />
            ))}
          </div>
          <div className='kpi-tickerbar__item'>
            {kpis.map((kpi) => (
              <KPITickerItem key={`${kpi.id}-3`} kpi={kpi} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { KPITickerBar }
