import type { VariableDeclarationNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext";
import { useDraggable } from "@dnd-kit/core";

export default function DeclaringVariable({
  node,
}: {
  node: VariableDeclarationNode;
}) {
  const { updateStatement } = useBlockContext();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={styles.block}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div className={styles.label}>
        <p className={styles.labelP}>{node.type}</p>
        <p {...listeners}>☰</p>
      </div>

      <div className={styles.content}>
        <input
          onChange={(e) => {
            updateStatement(node.id, (n) => {
              if (n.type !== "VariableDeclaration") return n;

              return {
                ...n,
                name: e.target.value,
              };
            });
          }}
          value={node.name}
          type="text"
          placeholder="a"
        />
      </div>
    </div>
  );
}
