import { useState, useEffect } from 'react'

export const useAlertsByType = () => {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Static mock data for chart
        const mockChartData = {
          series: [44, 55, 13, 43],
          labels: ['High', 'Medium', 'Low', 'Info']
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
