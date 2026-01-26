import { useState, useEffect } from 'react'
import { KPIData } from '../../types'

export const useProjectKPIs = () => {
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchKPIs = async () => {
      try {
        setLoading(true)
        
        // Mock data - replace with actual API call
        const mockKPIs: KPIData[] = [
          {
            id: '1',
            title: 'Progress',
            value: '92%',
            subtitle: '(Actual)',
            type: 'progress',
            icon: 'flaticon-grow-up',
            chartData: {
              planned: [10, 20, 35, 50, 65, 80, 88],
              actual: [12, 25, 40, 55, 70, 85, 92]
            }
          },
          {
            id: '2',
            title: 'Pro services',
            value: '51%',
            type: 'cost',
            icon: 'flaticon-grow-up',
            additionalInfo: [
              { label: 'As Sold Cost', value: '392 MMAD' },
              { label: 'Actual Cost', value: '635 MMAD' }
            ]
          },
          {
            id: '3',
            title: 'SOP Date',
            value: '35',
            subtitle: 'Days',
            type: 'date',
            icon: 'flaticon-grow-up',
            additionalInfo: [
              { label: 'Baseline', value: '10/01/2026' },
              { label: 'Forecast', value: '14/02/2026' }
            ]
          },
          {
            id: '4',
            title: 'TIC',
            value: '',
            type: 'chart',
            icon: 'flaticon-grow-up',
            chartData: {
              categories: ['Budget', 'Actual', 'Forecast'],
              values: [850, 720, 900]
            }
          }
        ]

        setKpis(mockKPIs)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch KPIs')
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [])

  return { kpis, loading, error }
}
