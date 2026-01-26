import { FC } from 'react'
import { useReality } from '../hooks/useReality'
import { KTIcon } from '@/_metronic/helpers'

const RealityCard: FC = () => {
  const { items, loading, currentIndex, setCurrentIndex } = useReality()

  if (loading) {
    return (
      <div className='card flex-grow-1'>
        <div className='card-body d-flex align-items-center justify-content-center'>
          <span className='spinner-border spinner-border-lg'></span>
        </div>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className='card flex-grow-1'>
      <div className='card-header pt-3 pb-3'>
        <h3 className='card-title'>
          <span className='card-label fw-bold text-gray-900'>Reality</span>
        </h3>
        <div className='card-toolbar m-0'>
          <a href='#' className='btn btn-icon btn-hover-light-primary draggable-handle'>
            <i className='ki-duotone ki-abstract-14 fs-2x'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
          </a>
        </div>
      </div>
      <div className='card-body'>
        <div
          id='kt_carousel_1_carousel'
          className='carousel carousel-custom slide'
          data-bs-ride='carousel'
          data-bs-interval='8000'
        >
          <div className='carousel-inner'>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
              >
                <div className='d-flex gap-3 align-items-center mb-4'>
                  <div className='symbol symbol-30px me-1'>
                    <span className='symbol-label border text-primary fw-bold fs-3'>
                      <KTIcon iconName={item.icon} className='mt-2' />
                    </span>
                  </div>
                  <div className='d-flex align-items-center w-100'>
                    <div>
                      <p className='fw-medium m-0 fs-5 text-muted'>{item.title}</p>
                    </div>
                  </div>
                </div>
                <div className='card mb-4'>
                  <div style={{ maxHeight: '267px' }}>
                    <img src={item.image} width='100%' alt={item.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='d-flex align-items-center justify-content-center flex-wrap'>
            <ol className='p-0 m-0 carousel-indicators carousel-indicators-bullet carousel-indicators-active-primary'>
              {items.map((_, index) => (
                <li
                  key={index}
                  data-bs-target='#kt_carousel_1_carousel'
                  data-bs-slide-to={index}
                  className={`ms-1 ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                ></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export { RealityCard }
