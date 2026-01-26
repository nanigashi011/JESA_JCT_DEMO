import { FC, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { ProjectInfoCard } from './ProjectInfo/components/ProjectInfoCard'
import { KPITickerBar } from './KPITicker/components/KPITickerBar'
import { AlertsCard } from './Alerts/components/AlertsCard'
import { MyActionsCard } from './MyActions/components/MyActionsCard'
import { SupportRequestCard } from './SupportRequest'
import { ApplicationsCard } from './Applications'
import { AlertsByTypeCard } from './AlertsByType'
import { AlertsByCategoryCard } from './AlertsByCategory'
import { RealityCard } from './Reality'
import { Footer } from './Footer'
import { useUserWidgets, type WidgetId } from './hooks/useUserWidgets'
import { SortableWidget } from './components/SortableWidget'

const WIDGET_COMPONENTS: Record<WidgetId, FC> = {
  myActions: MyActionsCard,
  supportRequest: SupportRequestCard,
  applications: ApplicationsCard,
  alertsByType: AlertsByTypeCard,
  alertsByCategory: AlertsByCategoryCard,
  reality: RealityCard,
}

const HomePage: FC = () => {
  const { visibleWidgets, widgetOrder, reorderWidgets } = useUserWidgets()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter and sort widgets based on visibility and order
  const orderedVisibleWidgets = useMemo(() => {
    return widgetOrder.filter((id) => visibleWidgets[id])
  }, [widgetOrder, visibleWidgets])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = orderedVisibleWidgets.indexOf(active.id as WidgetId)
      const newIndex = orderedVisibleWidgets.indexOf(over.id as WidgetId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(orderedVisibleWidgets, oldIndex, newIndex)
        
        // Update the full order array, maintaining hidden widgets in their positions
        const fullNewOrder = [...widgetOrder]
        const activeId = active.id as WidgetId
        const overId = over.id as WidgetId
        
        const activeIndexInFull = fullNewOrder.indexOf(activeId)
        const overIndexInFull = fullNewOrder.indexOf(overId)
        
        if (activeIndexInFull !== -1 && overIndexInFull !== -1) {
          const [moved] = fullNewOrder.splice(activeIndexInFull, 1)
          fullNewOrder.splice(overIndexInFull, 0, moved)
          reorderWidgets(fullNewOrder)
        }
      }
    }
  }

  return (
    <>
      {/* Main Content */}
      <div className='content content-page d-flex flex-column flex-column-fluid'>
        <div className='container-fluid'>
          {/* Row 1: KPIs */}
          <div className='row mt-3 mb-4 align-items-stretch'>
            {/* Project Information Card */}
            <div className='col-lg-4 col-md-4 col-12'>
              <ProjectInfoCard />
            </div>

            {/* KPI Ticker & Alerts */}
            <div className='col-xl-8 col-md-8 col-12'>
              <div className='row'>
                {/* KPI Ticker Bar */}
                <div className='col-12'>
                  <KPITickerBar />
                </div>

                {/* Alerts Card */}
                <div className='col-12'>
                  <AlertsCard />
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Widgets Row */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedVisibleWidgets}
              strategy={rectSortingStrategy}
            >
              <div className='row g-4 align-items-stretch draggable-zone'>
                {orderedVisibleWidgets.map((widgetId) => {
                  const WidgetComponent = WIDGET_COMPONENTS[widgetId]
                  return (
                    <SortableWidget key={widgetId} id={widgetId}>
                      <WidgetComponent />
                    </SortableWidget>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  )
}

export { HomePage }
