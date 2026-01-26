import { FC } from 'react'
import { TickerKPI } from '../../types'
import { KTIcon } from '@/_metronic/helpers'
import clsx from 'clsx'

interface KPITickerItemProps {
  kpi: TickerKPI
}

const KPITickerItem: FC<KPITickerItemProps> = ({ kpi }) => {
  const getTrendColorClass = () => {
    if (kpi.trend === 'up') return 'success'
    if (kpi.trend === 'down') return 'warning'
    return 'info'
  }

  const getTrendIcon = () => {
    if (kpi.trend === 'up') return 'arrow-up'
    if (kpi.trend === 'down') return 'arrow-down'
    return 'minus'
  }

  const colorClass = getTrendColorClass()

  return (
    <div className='kpi-item-ticker'>
      <span className='me-3 fw-semibold fs-6'>{kpi.label}</span>
      <span
        className={clsx('position-relative', `text-${colorClass}`)}
        style={{ top: '1px' }}
      >
        <span className={clsx('badge fs-base', `badge-light-${colorClass}`)}>
          <KTIcon
            iconName={getTrendIcon()}
            className={clsx('fs-5 me-2', `text-${colorClass}`)}
          />
          {kpi.trendValue}
        </span>
      </span>
    </div>
  )
}

export { KPITickerItem }
