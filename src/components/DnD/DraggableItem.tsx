import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItemType } from '../../types/dnd';

interface Props {
  item: ItemType;
  isDragging?: boolean;
  onDelete?: (id: string) => void;
}

const DraggableItem: React.FC<{
  item: ItemType;
  isDragging?: boolean;
  onDelete?: (id: string) => void;
}> = ({ item, isDragging, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dndDragging,
  } = useSortable({ id: item.id });

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
    console.log('xoá item');
    e.stopPropagation();
    if (onDelete) onDelete(item.id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {onDelete && (
        <div
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
        </div>
      )}
      <div {...listeners}>{item.component}</div>
    </div>
  );
};

export default DraggableItem;
