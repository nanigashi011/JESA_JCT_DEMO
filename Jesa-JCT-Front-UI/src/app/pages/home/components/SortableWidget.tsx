import { FC, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableWidgetProps {
  id: string
  children: ReactNode
}

export const SortableWidget: FC<SortableWidgetProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="col-lg-4 col-md-4 col-sm-12"
    >
      <div
        {...attributes}
        {...listeners}
        className="widget-drag-handle"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {children}
      </div>
    </div>
  )
}
