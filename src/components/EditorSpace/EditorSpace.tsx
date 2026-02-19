import { DndContext } from "@dnd-kit/core";
import styles from "./EditorSpace.module.css";

export default function EditorSpace() {
  const dragEnd = (event: unknown) => {
    console.log(event);
  };

  return (
    <DndContext onDragEnd={dragEnd}>
      <div className={styles.test}></div>
    </DndContext>
  );
}
