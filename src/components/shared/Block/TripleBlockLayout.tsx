import type { ReactNode } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext.tsx";

type Props = {
  node: {
    id: string;
    x: number;
    y: number;
    type: string;
  };
  children: ReactNode;
};

export default function TripleBlockLayout({ node, children }: Props) {
  const { removeStatement } = useBlockContext();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { type: "node" },
  });

  const { setNodeRef: setInputRef } = useDroppable({
    id: `input-${node.id}`,
    data: { type: "input", nodeId: node.id },
  });

  const {
    attributes: outAttr1,
    listeners: outListeners1,
    setNodeRef: setOutRef1,
  } = useDraggable({
    id: `output1-${node.id}`,
    data: { type: "output1", nodeId: node.id },
  });
  const {
    attributes: outAttr,
    listeners: outListeners,
    setNodeRef: setOutRef,
  } = useDraggable({
    id: `output-${node.id}`,
    data: { type: "output", nodeId: node.id },
  });
  const {
    attributes: outAttr2,
    listeners: outListeners2,
    setNodeRef: setOutRef2,
  } = useDraggable({
    id: `output2-${node.id}`,
    data: { type: "output2", nodeId: node.id },
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
      <div
        ref={setInputRef}
        id={`input-${node.id}`}
        className={styles.inputConnector}
      />

      <div className={styles.label}>
        <div className={styles.labelFlex}>
          <div
            onClick={() => {
              removeStatement(node.id);
            }}
            className={styles.buttonDelete}
          >
            -
          </div>
          <p className={styles.labelP}>{node.type}</p>
        </div>
        <p {...listeners}>☰</p>
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.outputConnectors}>
        <div
          id={`out-true-${node.id}`}
          ref={setOutRef1}
          {...outListeners1}
          {...outAttr1}
          className={styles.output}
          title="True"
        />
        <div
          id={`out-${node.id}`}
          ref={setOutRef}
          {...outListeners}
          {...outAttr}
          className={styles.output}
        />
        {node.type === "If" && (
          <div
            id={`out-false-${node.id}`}
            ref={setOutRef2}
            {...outListeners2}
            {...outAttr2}
            className={styles.output}
          />
        )}
      </div>
    </div>
  );
}
