import type { PrintNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Print({ node }: { node: PrintNode }) {
  const { updateStatement } = useBlockContext();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });

  const [inputValue, setInputValue] = useState(
    renderExpression(node.expression),
  );

  useEffect(() => {
    setInputValue(renderExpression(node.expression));
  }, [node.expression]);

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
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);

            try {
              const parsed = stringToExpression(value);

              updateStatement(node.id, (n) => {
                if (n.type !== "Print") return n;

                return {
                  ...n,
                  expression: parsed,
                };
              });
            } catch {}
          }}
          type="text"
          placeholder="a + 5"
        />
      </div>
    </div>
  );
}
