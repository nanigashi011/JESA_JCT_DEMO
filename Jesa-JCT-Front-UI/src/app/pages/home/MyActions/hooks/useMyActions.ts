import { useState, useEffect } from 'react'
import { Action } from '../../types'

export const useMyActions = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true)
        
        // Static mock data matching HTML structure
        const mockActions: Action[] = [
          {
            id: '1',
            title: 'Schedule Slippage',
            description: 'Delay detected between theoretical planning and real progress.',
            priority: 'high',
            dueDate: '2026-01-12',
            status: 'pending',
            assignedTo: 'Ibrahim Chiref',
            category: 'Planning'
          },
          {
            id: '2',
            title: 'Minor Deviation in Weekly Progress',
            description:
              'Small delay observed in weekly execution compared to the approved planning. Impact remains limited but requires monitoring to avoid escalation.',
            priority: 'medium',
            dueDate: '2026-01-13',
            status: 'pending',
            assignedTo: 'My self',
            category: 'Engineering'
          },
          {
            id: '3',
            title: 'Update Progress Reporting Data',
            description:
              'Progress data needs to be updated to reflect the latest site information. No impact on schedule identified at this stage.',
            priority: 'low',
            dueDate: '2026-01-05',
            status: 'pending',
            assignedTo: 'Samira Essalami',
            category: 'Reporting'
          }
        ]

        setActions(mockActions)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchActions()
  }, [])

  return { actions, loading }
}
