import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./Block.module.css";
import type { ReactNode } from "react";

type Props = {
  node: {
    id: string;
    x: number;
    y: number;
    type: string;
  };
  children: ReactNode;
  inputs?: number;
  outputs?: number;
};

export default function BaseBlockLayout({
  node,
  children,
  inputs = 1,
  outputs = 1,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { type: "node" },
  });

  const { setNodeRef: setInputRef } = useDroppable({
    id: `input-${node.id}`,
    data: { type: "input", nodeId: node.id },
  });

  const {
    attributes: outAttr,
    listeners: outListeners,
    setNodeRef: setOutRef,
  } = useDraggable({
    id: `output-${node.id}`,
    data: { type: "output", nodeId: node.id },
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
      {inputs > 0 && (
        <div ref={setInputRef} className={styles.inputConnector} />
      )}

      <div className={styles.label}>
        <p className={styles.labelP}>{node.type}</p>
        <p {...listeners}>☰</p>
      </div>

      <div className={styles.content}>{children}</div>

      {outputs > 0 && (
        <div
          ref={setOutRef}
          {...outListeners}
          {...outAttr}
          className={styles.outputConnector}
        />
      )}
    </div>
  );
}
