import "./App.module.css";
import Overlay from "../../components/Overlay/Overlay";
import EditorSpace from "../../components/EditorSpace/EditorSpace";
import { DndContext } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import { createNode } from "../../logic/nodeFactory";
import { useState } from "react";
import ToolBar from "../../components/Toolbar/ToolBar.tsx";

export default function App() {
  const { addStatement } = useBlockContext();
  const [panMain, setPanMain] = useState({ x: -5000, y: -5000 });

  const dragEnd = (event: any) => {
    const { active, over, delta } = event;

    if (!over) return;

    if (over.id === "root") {
      const type = active.data.current?.type;

      if (!type) return;

      const newNode = createNode(type);
      newNode.x = newNode.x + delta.x - panMain.x;
      newNode.y = newNode.y + delta.y - panMain.y;
      console.log(newNode.x, newNode.y);
      addStatement(newNode);
    }
  };

  return (
    <DndContext onDragEnd={dragEnd}>
      <Overlay />
      <EditorSpace setPanMain={setPanMain} />
      <ToolBar />
    </DndContext>
  );
}
