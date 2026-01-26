import { useState, useEffect } from 'react'

export const useAlertsByCategory = () => {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Static mock data for chart
        const mockChartData = {
          series: [30, 25, 20, 15, 10],
          labels: ['Planning', 'Engineering', 'Technical', 'Administrative', 'MOM']
        }

        setChartData(mockChartData)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { chartData, loading }
}
