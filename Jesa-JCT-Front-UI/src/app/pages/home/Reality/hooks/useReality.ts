import { useState, useEffect } from 'react'
import { RealityItem } from '../../types'

export const useReality = () => {
  const [items, setItems] = useState<RealityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Static mock data
        const mockItems: RealityItem[] = [
          {
            id: '1',
            title: 'Camera & CCTV',
            icon: 'security-camera',
            image: '/media/img/plan.png'
          },
          {
            id: '2',
            title: '3D',
            icon: 'cube',
            image: '/media/img/3d.png'
          }
        ]

        setItems(mockItems)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { items, loading, currentIndex, setCurrentIndex }
}
