import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';

import { arrayMove } from '@dnd-kit/sortable';
import { ColumnType } from '../../types/dnd';
import DroppableColumn from './DroppableColumn';
import DraggableItem from './DraggableItem';

interface Props {
  initialColumns: ColumnType[];
}

const DnDContainer: React.FC<{ initialColumns: ColumnType[] }> = ({
  initialColumns,
}) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const findContainer = (id: string): string | null => {
    return (
      columns.find((col) => col.items.find((item) => item.id === id))?.id ??
      null
    );
  };

  const handleDelete = (id: string) => {
    console.log({ id });
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        items: col.items.filter((item) => item.id !== id),
      }))
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const fromId = findContainer(active.id);
    const toId = findContainer(over.id) || over.id;

    if (!fromId || !toId) return;

    const updated = [...columns];
    const fromCol = updated.find((col) => col.id === fromId)!;
    const toCol = updated.find((col) => col.id === toId)!;

    const movingItem = fromCol.items.find((item) => item.id === active.id)!;

    if (fromId === toId) {
      const oldIndex = fromCol.items.findIndex((item) => item.id === active.id);
      const newIndex = fromCol.items.findIndex((item) => item.id === over.id);
      fromCol.items = arrayMove(fromCol.items, oldIndex, newIndex);
    } else {
      fromCol.items = fromCol.items.filter((item) => item.id !== active.id);
      const insertIndex = toCol.items.findIndex((item) => item.id === over.id);
      toCol.items.splice(
        insertIndex === -1 ? toCol.items.length : insertIndex,
        0,
        movingItem
      );
    }

    setColumns(updated);
  };

  const allItems = columns.flatMap((col) => col.items);
  const activeItem = activeId ? allItems.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', padding: 20, flex: 1 }}>
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            items={col.items}
            activeId={activeId}
            onDelete={handleDelete}
            title={col.title}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div style={{ pointerEvents: 'auto' }}>
            <DraggableItem
              item={activeItem}
              isDragging={true}
              onDelete={handleDelete}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DnDContainer;
