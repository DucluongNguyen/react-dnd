// App.tsx
import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import DroppableColumn, { ItemType } from './DroppableColumn';
import { useDragStart } from './useDragStart';
import { useDragEnd } from './useDragEnd';
import Item from './Item';


const App: React.FC = () => {
  const [leftItems, setLeftItems] = useState<ItemType[]>([
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
  ]);
  const [rightItems, setRightItems] = useState<ItemType[]>([
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ]);

  const { activeId, handleDragStart } = useDragStart();
  const { handleDragEnd } = useDragEnd(leftItems, rightItems, setLeftItems, setRightItems);

  const allItems = [...leftItems, ...rightItems];
  const activeItem = activeId ? allItems.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', padding: '20px' }}>
        <DroppableColumn items={leftItems} id="left" activeId={activeId} />
        <DroppableColumn items={rightItems} id="right" activeId={activeId} />
      </div>
      <DragOverlay>{activeItem ? <Item item={activeItem} /> : null}</DragOverlay>
    </DndContext>
  );
};

export default App;
