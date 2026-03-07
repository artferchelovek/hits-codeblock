import "./App.module.css";
import Overlay from "../../components/Overlay/Overlay";
import EditorSpace from "../../components/EditorSpace/EditorSpace";
import { DndContext } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import { createNode } from "../../logic/nodeFactory";
import { useState } from "react";
import ToolBar from "../../components/Toolbar/ToolBar.tsx";

export default function App() {
  const { addStatement, updateStatement } = useBlockContext();
  const [panMain, setPanMain] = useState({ x: -5000, y: -5000 });

  const dragEnd = (event: any) => {
    const { active, over, delta } = event;

    if (!over) return;

    if (active.data.current?.type === "node") {
      updateStatement(active.id, (node) => ({
        ...node,
        x: node.x + delta.x,
        y: node.y + delta.y,
      }));
      return;
    }

    if (over?.id === "root" && String(active.id).startsWith("palette-")) {
      const type = active.data.current?.type;
      if (type) {
        const draggedRect = active.rect.current.translated;

        const editorEl = document.getElementById("editor");
        const rect = editorEl?.getBoundingClientRect();

        if (rect) {
          const newNode = createNode(type);
          newNode.x = draggedRect.left - rect.left - panMain.x;
          newNode.y = draggedRect.top - rect.top - panMain.y;
          addStatement(newNode);
        }
      }
    }
  };

  return (
    <DndContext onDragEnd={dragEnd}>
      <Overlay />
      <EditorSpace setPanMain={setPanMain} panMain={panMain} />
      <ToolBar />
    </DndContext>
  );
}
