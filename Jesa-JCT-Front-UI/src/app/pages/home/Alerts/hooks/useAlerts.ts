import { useState, useEffect } from 'react'
import { Alert } from '../../types'

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        
        // Mock data - replace with actual API call
        const mockAlerts: Alert[] = [
          {
            id: '1',
            title: 'SOP Date Slippage',
            type: 'danger',
            projectName: 'Benguerir Benefication Plant',
            reportingDate: '17/12/2025',
            impactedActivities: 2,
            baseline: '17/12/2025',
            forecast: '31/12/2025',
            daysDelay: 14,
            hasTeams: true
          },
          {
            id: '2',
            title: 'PEN',
            type: 'warning',
            projectName: "Intermediate Storage M'zinda",
            reportingDate: '11/12/2025',
            impactedActivities: 3,
            wpsImage: 'media/icons/wbs-3.svg'
          },
          {
            id: '3',
            title: 'Budget Overrun',
            type: 'warning',
            projectName: 'New Mining Facility',
            reportingDate: '15/12/2025',
            impactedActivities: 5,
            baseline: '01/01/2026',
            forecast: '15/01/2026',
            daysDelay: 14
          },
          {
            id: '4',
            title: 'Safety Alert',
            type: 'danger',
            projectName: 'Infrastructure Upgrade',
            reportingDate: '18/12/2025',
            impactedActivities: 1,
            hasTeams: true
          },
          {
            id: '5',
            title: 'Resource Allocation',
            type: 'info',
            projectName: 'Quality Control Project',
            reportingDate: '20/12/2025',
            impactedActivities: 2
          },
          {
            id: '6',
            title: 'XXXXXXXXXX',
            type: 'danger',
            projectName: 'XXXXXXXXXX',
            reportingDate: '17/12/2025',
            impactedActivities: 2,
            baseline: '17/12/2025',
            forecast: '31/12/2025',
            daysDelay: 14,
            hasTeams: true
          }
        ]

        setAlerts(mockAlerts)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  return { alerts, loading }
}
