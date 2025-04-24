import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  rectIntersection,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ItemType {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface ItemProps {
  item: ItemType;
  isDragging?: boolean;
  onDelete?: (id: string) => void;
}

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
    // transform: CSS.Transform.toString(transform),
    transition,
    // opacity: isDragging ? 0.5 : 1,
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
        minHeight: "300px",
        margin: "0 10px",
        background: "#E1BEE7",
        padding: "10px",
        borderRadius: "12px",
        display:"flex"
      }}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        {items.map((item) => (
          <Item key={item.id} item={item} isDragging={activeId === item.id} onDelete={onDelete} />
        ))}
        {items.length === 0 && (
          <div style={{ height: "100px", border: "2px dashed #ccc", borderRadius: "12px" }}>
            Thả vào đây
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const App: React.FC = () => {
  const [leftItems, setLeftItems] = useState<ItemType[]>([
    {
      id: "A",
      label: "A",
      component: <iframe src="https://example.com" title="A" style={{ width: "100%", height: "200px" }} />,
    },
    {
      id: "B",
      label: "B",
      component: <iframe src="https://chat.openai.com/" title="B" style={{ width: "100%", height: "200px" }} />,
    },
  ]);

  const [rightItems, setRightItems] = useState<ItemType[]>([
    {
      id: "C",
      label: "C",
      component: <iframe src="https://weather.com/widget" title="C" style={{ width: "100%", height: "200px" }} />,
    },
    {
      id: "D",
      label: "D",
      component: <iframe src="https://forecast.io/widget" title="D" style={{ width: "100%", height: "200px" }} />,
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = (id: string): "left" | "right" | null => {
    if (leftItems.find((item) => item.id === id)) return "left";
    if (rightItems.find((item) => item.id === id)) return "right";
    return null;
  };

  const handleDelete = (id: string) => {
    setLeftItems((prev) => prev.filter((item) => item.id !== id));
    setRightItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) {
      console.warn("DragEnd không có 'over' target:", active.id);
      return;
    }
    if (active.id === over.id) return;

    const from = findContainer(active.id as string);
    const to = findContainer(over.id as string) || (over.id as string);

    if (!from || !to) return;

    const fromList = from === "left" ? leftItems : rightItems;
    const toList = to === "left" ? leftItems : rightItems;
    const setFromList = from === "left" ? setLeftItems : setRightItems;
    const setToList = to === "left" ? setLeftItems : setRightItems;

    const movingItem = fromList.find((item) => item.id === active.id);
    if (!movingItem) return;

    if (from === to) {
      const oldIndex = fromList.findIndex((item) => item.id === active.id);
      const newIndex = fromList.findIndex((item) => item.id === over.id);
      if (oldIndex !== newIndex) {
        setFromList(arrayMove(fromList, oldIndex, newIndex));
      }
    } else {
      const insertIndex = toList.findIndex((item) => item.id === over.id);
      const newToList = [...toList];
      newToList.splice(insertIndex === -1 ? toList.length : insertIndex, 0, movingItem);
      setToList(newToList);
      setFromList(fromList.filter((item) => item.id !== active.id));
    }
  };

  const allItems = [...leftItems, ...rightItems];
  const activeItem = activeId ? allItems.find((item) => item.id === activeId) : null;

  return (
    <>
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", padding: "20px" }}>
          <DroppableColumn id="left" items={leftItems} activeId={activeId} onDelete={handleDelete} />
          <DroppableColumn id="right" items={rightItems} activeId={activeId} onDelete={handleDelete} />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div style={{ pointerEvents: "none" }}>
              <Item item={activeItem} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style>
        {`
          .item-container:hover .drag-handle,
          .item-container:hover .delete-button {
            opacity: 1 !important;
          }
        `}
      </style>
    </>
  );
};

export default App;