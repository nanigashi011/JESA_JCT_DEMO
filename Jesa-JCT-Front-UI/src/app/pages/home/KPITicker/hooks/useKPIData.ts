import { useState, useEffect } from 'react'
import { TickerKPI } from '../../types'

export const useKPIData = () => {
  const [kpis, setKpis] = useState<TickerKPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchKPIData = async () => {
      try {
        setLoading(true)
        
        // Mock data - replace with actual API call
        const mockKPIs: TickerKPI[] = [
          {
            id: '1',
            label: 'Revenue',
            value: '33.37 B',
            trend: 'up',
            trendValue: '33.37 B'
          },
          {
            id: '2',
            label: 'GM%',
            value: '53%',
            trend: 'up',
            trendValue: '53%'
          },
          {
            id: '3',
            label: 'CPI',
            value: '12.11 B',
            trend: 'up',
            trendValue: '12.11 B'
          },
          {
            id: '4',
            label: 'SPI',
            value: '0.89',
            trend: 'down',
            trendValue: '0.89'
          },
          {
            id: '5',
            label: 'WPI',
            value: '25.94 B',
            trend: 'up',
            trendValue: '25.94 B'
          }
        ]

        setKpis(mockKPIs)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchKPIData()
  }, [])

  return { kpis, loading }
}
