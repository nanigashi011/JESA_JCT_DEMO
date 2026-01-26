import { useState, useEffect } from 'react'
import { Application } from '../../types'

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)

        // Static mock data
        const mockApplications: Application[] = [
          {
            id: '1',
            name: 'Aconex',
            icon: '/media/clients/aconex.png',
            enabled: true
          },
          {
            id: '2',
            name: 'Procore',
            icon: '/media/clients/procore.png',
            enabled: true
          },
          {
            id: '3',
            name: 'Primavera',
            icon: '/media/clients/p6.png',
            enabled: true
          },
          {
            id: '4',
            name: 'HSE',
            icon: '/media/clients/nefs.png',
            enabled: true
          },
          {
            id: '5',
            name: 'Field Service',
            icon: '/media/clients/field-service.png',
            enabled: true
          },
          {
            id: '6',
            name: 'QRPM',
            icon: '/media/clients/qrpm.png',
            enabled: true
          },
          {
            id: '7',
            name: 'J-Pass',
            icon: '/media/clients/jpass.png',
            enabled: true
          },
          {
            id: '8',
            name: 'My Jesa',
            icon: '/media/clients/myjesa.png',
            enabled: true
          },
          {
            id: '9',
            name: 'Collab 360',
            icon: '/media/clients/collab360.png',
            enabled: false
          },
          {
            id: '10',
            name: 'TIQAD',
            icon: '/media/clients/tiqad.png',
            enabled: false
          },
          {
            id: '11',
            name: 'ESP',
            icon: '/media/clients/esp.png',
            enabled: false
          },
          {
            id: '12',
            name: 'Bloom',
            icon: '/media/clients/bloom.png',
            enabled: false
          },
          {
            id: '13',
            name: 'OPC',
            icon: '/media/clients/opc.png',
            enabled: false
          },
          {
            id: '14',
            name: 'SAFRAN',
            icon: '/media/clients/safran.png',
            enabled: false
          }
        ]

        setApplications(mockApplications)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const toggleApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, enabled: !app.enabled } : app))
    )
  }

  return { applications, loading, toggleApplication }
}
