import React, { useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ItemType } from "./DroppableColumn";

interface ItemProps {
  item: ItemType;
}

// Item.tsx
const Item: React.FC<ItemProps> = ({ item, isDragging, onDelete }) => {
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
    background: "#fff",
    borderRadius: "12px",
    margin: "10px",
    padding: "0px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const iframes = containerRef.current.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        iframe.style.pointerEvents = isDragging || dndDragging ? "none" : "auto";
      });
    }
  }, [isDragging, dndDragging]);

  return (
    <div ref={setNodeRef} style={style} className="item-container">
      <div
        {...attributes}
        {...listeners}
        style={{
          position: "absolute",
          left: 6,
          top: 6,
          background: "#eee",
          borderRadius: "6px",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          cursor: "grab",
          opacity: 0,
          transition: "opacity 0.2s",
          zIndex: 10,
        }}
        className="drag-handle"
      >
        ≡
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "#ff5252",
            border: "none",
            color: "white",
            borderRadius: "50%",
            width: 24,
            height: 24,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            opacity: 0,
            transition: "opacity 0.2s",
            zIndex: 10,
          }}
          className="delete-button"
        >
          ×
        </button>
      )}

      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        {item.component}
      </div>
    </div>
  );
};
  
  export default Item