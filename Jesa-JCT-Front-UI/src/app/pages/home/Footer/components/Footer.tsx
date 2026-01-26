import { FC } from 'react'

const Footer: FC = () => {
  return (
    <div
      id='kt_app_footer'
      className='d-flex flex-column flex-md-row align-items-center flex-center flex-md-stack ps-10 py-2'
    >
      <div className='text-gray-900 order-2 order-md-1'>
        <span className='text-muted fw-semibold me-1'>2026©</span>
        <a href='30' target='_blank' className='text-gray-800 text-hover-primary'>
          JESA
        </a>
      </div>
    </div>
  )
}

export { Footer }
