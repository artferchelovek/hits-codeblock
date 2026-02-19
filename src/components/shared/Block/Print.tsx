import type { PrintNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useEffect, useState } from "react";

export default function Print({ node }: { node: PrintNode }) {
  const { updateStatement } = useBlockContext();

  const [inputValue, setInputValue] = useState(
    renderExpression(node.expression),
  );

  useEffect(() => {
    setInputValue(renderExpression(node.expression));
  }, [node.expression]);

  return (
    <div className={styles.block}>
      <div className={styles.label}>
        <p className={styles.labelP}>{node.type}</p>
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
