// useDragEnd.ts
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { ItemType } from './ItemType';

export const useDragEnd = (
  leftItems: ItemType[],
  rightItems: ItemType[],
  setLeftItems: React.Dispatch<React.SetStateAction<ItemType[]>>,
  setRightItems: React.Dispatch<React.SetStateAction<ItemType[]>>
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = (id: string): 'left' | 'right' | null => {
    if (leftItems.find((item) => item.id === id)) return 'left';
    if (rightItems.find((item) => item.id === id)) return 'right';
    return null;
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const from = findContainer(active.id as string);
    const to = findContainer(over.id as string) || (over.id as string);

    if (!from || !to) return;

    const fromList = from === 'left' ? leftItems : rightItems;
    const toList = to === 'left' ? leftItems : rightItems;
    const setFromList = from === 'left' ? setLeftItems : setRightItems;
    const setToList = to === 'left' ? setLeftItems : setRightItems;

    const movingItem = fromList.find((item) => item.id === active.id);
    if (!movingItem) return;

    if (from === to) {
      const oldIndex = fromList.findIndex((item) => item.id === active.id);
      const newIndex = fromList.findIndex((item) => item.id === over.id);
      if (oldIndex !== newIndex) {
        setFromList(arrayMove(fromList, oldIndex, newIndex));
      }
    } else {
      const newToList = [...toList];
      let insertIndex = newToList.findIndex((item) => item.id === over.id);
      if (insertIndex === -1 || over.id === to) {
        insertIndex = newToList.length;
      }
      newToList.splice(insertIndex, 0, movingItem);
      setToList(newToList);
      setFromList(fromList.filter((item) => item.id !== active.id));
    }
  };

  return { activeId, handleDragEnd };
};
