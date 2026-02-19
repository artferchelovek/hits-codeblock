import { useDroppable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import styles from "./EditorSpace.module.css";
import RenderNode from "../../logic/RenderNode";

export default function EditorSpace() {
  const { program } = useBlockContext();

  const { setNodeRef } = useDroppable({
    id: "root",
  });

  return (
    <div ref={setNodeRef} className={styles.editor}>
      {program.body.map((node) => (
        <RenderNode key={node.id} node={node} />
      ))}
    </div>
  );
}
