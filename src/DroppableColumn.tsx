import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Item from "./Item";


export interface ItemType {
    id: string;
    label: string;
  }

interface DroppableColumnProps {
  items: ItemType[];
  id: string;
  activeId: string | null;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ items, id, activeId }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minHeight: "300px",
        margin: "0 10px",
        background: "#7C4DFF",
        padding: "10px",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </SortableContext>
    </div>
  );
};

export default DroppableColumn;