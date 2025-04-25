import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { ItemType } from '../../types/dnd';
import DraggableItem from './DraggableItem';

interface Props {
  id: string;
  items: ItemType[];
  activeId: string | null;
  onDelete: (id: string) => void;
}

const DroppableColumn: React.FC<{
  id: string;
  items: ItemType[];
  activeId: string | null;
  onDelete: (id: string) => void;
  title: string;
}> = ({ id, items, activeId, onDelete, title }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        height: 'inherit',
        minHeight: '300px',
        margin: '0 1px',
        background: '#E1BEE7',
        padding: '10px',
        borderRadius: '12px',
      }}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div>
          <strong>{title}</strong>
        </div>
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            isDragging={activeId === item.id}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default DroppableColumn;
