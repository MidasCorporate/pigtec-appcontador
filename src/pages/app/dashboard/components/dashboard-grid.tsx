"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"

import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useDashboard } from "@/context/dashboard-context"
import { DraggableChart } from "./draggable-chart"

export function DashboardGrid() {
  const { charts, updateCharts } = useDashboard()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = charts.findIndex((chart) => chart.id === active.id)
      const newIndex = charts.findIndex((chart) => chart.id === over?.id)

      const newCharts = arrayMove(charts, oldIndex, newIndex).map((chart, index) => ({
        ...chart,
        position: index,
      }))

      updateCharts(newCharts)
    }
  }

  const sortedCharts = [...charts].sort((a, b) => a.position - b.position)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedCharts.map((chart) => chart.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-min">
          {sortedCharts.map((chart) => (
            <DraggableChart key={chart.id} chart={chart} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
