// useDragStart.ts
import { useState } from 'react';

export const useDragStart = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string);
  };

  return {
    activeId,
    handleDragStart,
  };
};
