import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface ItemType {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface ColumnType {
  id: string;
  items: ItemType[];
}

const DraggableItem: React.FC<{
  item: ItemType;
  isDragging?: boolean;
  onDelete?: (id: string) => void;
}> = ({ item, isDragging, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: '#fff',
    borderRadius: '12px',
    margin: '10px',
    padding: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    cursor: 'grab',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(item.id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {onDelete && (
        <button
          onClick={handleClick}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: '#ff5252',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 16,
            zIndex: 10,
          }}
        >
          ×
        </button>
      )}
      {item.component}
    </div>
  );
};

const DroppableColumn: React.FC<{
  id: string;
  items: ItemType[];
  activeId: string | null;
  onDelete: (id: string) => void;
}> = ({ id, items, activeId, onDelete }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minHeight: '300px',
        margin: '0 10px',
        background: '#E1BEE7',
        padding: '10px',
        borderRadius: '12px',
      }}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            isDragging={activeId === item.id}
            onDelete={onDelete}
          />
        ))}
        {items.length === 0 && (
          <div
            style={{
              height: '100px',
              border: '2px dashed #ccc',
              borderRadius: '12px',
            }}
          >
            Thả vào đây
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const DnDContainer: React.FC<{ initialColumns: ColumnType[] }> = ({
  initialColumns,
}) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = (id: string): string | null => {
    return (
      columns.find((col) => col.items.find((item) => item.id === id))?.id ??
      null
    );
  };

  const handleDelete = (id: string) => {
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
      <div style={{ display: 'flex', padding: 20 }}>
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            items={col.items}
            activeId={activeId}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <DraggableItem
            item={activeItem}
            isDragging={true}
            onDelete={handleDelete}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DnDContainer;
