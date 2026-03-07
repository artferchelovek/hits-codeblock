import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./Block.module.css";
import { type ReactNode } from "react";
import { useBlockContext } from "../../../context/BlockContext.tsx";
import SvgMove from "../../../svg/SvgMove.tsx";

type Props = {
  node: {
    id: string;
    x: number;
    y: number;
    type: string;
  };
  children: ReactNode;
};

export default function BaseBlockLayout({ node, children }: Props) {
  const { removeStatement, activeNode, errorNode } = useBlockContext();

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

  const isError = errorNode.node === node.id;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`${styles.block} ${activeNode === node.id ? styles.active : ""} ${isError ? styles.error : ""}`}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {node.type !== "StartNode" && (
        <div
          ref={setInputRef}
          id={`input-${node.id}`}
          className={styles.inputConnector}
        />
      )}

      {isError && (
        <div className={styles.errorMessage}>{errorNode.message}</div>
      )}

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
        <p
          {...listeners}
          style={{
            cursor: "grab",
          }}
        >
          <SvgMove
            width={20}
            height={20}
            fill="var(--md-sys-color-on-secondary-container)"
          />
        </p>
      </div>

      <div className={styles.content}>{children}</div>

      <div
        id={`out-${node.id}`}
        ref={setOutRef}
        {...outListeners}
        {...outAttr}
        className={styles.outputConnector}
      />
    </div>
  );
}
