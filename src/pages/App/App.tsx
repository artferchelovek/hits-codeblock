import "./App.module.css";
import Overlay from "../../components/Overlay/Overlay";
import EditorSpace from "../../components/EditorSpace/EditorSpace";
import { DndContext } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import { createNode } from "../../logic/nodeFactory";

export default function App() {
  const { addStatement } = useBlockContext();

  const dragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (over.id === "root") {
      const type = active.data.current?.type;

      if (!type) return;

      const newNode = createNode(type);
      addStatement(null, newNode);
    }
  };

  return (
    <DndContext onDragEnd={dragEnd}>
      <Overlay />
      <EditorSpace />
    </DndContext>
  );
}
