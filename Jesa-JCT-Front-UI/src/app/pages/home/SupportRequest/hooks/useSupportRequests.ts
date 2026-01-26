import { useState, useEffect } from 'react'
import { SupportRequest } from '../../types'

export const useSupportRequests = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)

        // Static mock data
        const mockRequests: SupportRequest[] = [
          {
            id: '1',
            title: 'Server Downtime Alert',
            description:
              'Critical downtime detected on the main production server. Immediate action is required to restore services and prevent operational disruption.',
            priority: 'high',
            category: 'IT Support',
            from: 'Jamal Machkour',
            startDate: '15/01/2026',
            endDate: '15/01/2026',
            days: 0,
            canAssign: false
          },
          {
            id: '2',
            title: 'Software Update Required',
            description:
              'A minor update is available for the accounting software. It needs to be installed to ensure compatibility with recent system patches.',
            priority: 'medium',
            category: 'Software',
            from: 'My self',
            startDate: '12/01/2026',
            endDate: '16/01/2026',
            days: 4,
            canAssign: false
          },
          {
            id: '3',
            title: 'Update Project Documentation',
            description:
              'Review and update all internal project documents for accuracy and consistency. Ensure all team members have access to the latest versions.',
            priority: 'medium',
            category: 'Planning',
            from: 'Ilham Ben Chekroun',
            startDate: '13/01/2026',
            endDate: '17/01/2026',
            days: 4,
            canAssign: true
          },
          {
            id: '4',
            title: 'Update Progress Reporting Data',
            description:
              'Progress data needs to be updated to reflect the latest site information. No impact on schedule identified at this stage.',
            priority: 'low',
            category: 'Reporting',
            from: 'Samira Essalami',
            startDate: '05/01/2026',
            endDate: '31/01/2026',
            days: 25,
            canAssign: false
          }
        ]

        setRequests(mockRequests)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return { requests, loading }
}
