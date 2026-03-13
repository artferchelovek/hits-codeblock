import type { ReturnNode } from "../../../types/ast.ts";
import BaseBlockLayout from "./BaseBlockLayout.tsx";
import { useProgramContext } from "../../../context/ProgramContext.tsx";
import styles from "./Block.module.css";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useState, useEffect } from "react";

export default function Return({ node }: { node: ReturnNode }) {
  const { updateStatement } = useProgramContext();

  const [inputValue, setInputValue] = useState(
    node.argument ? renderExpression(node.argument) : "",
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(node.argument ? renderExpression(node.argument) : "");
  }, [node.argument]);

  return (
    <BaseBlockLayout node={node}>
      <div className={styles.content}>
        <input
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            try {
              const parsed = value.trim() ? stringToExpression(value) : null;
              updateStatement(node.id, (n) => {
                if (n.type !== "Return") return n;
                return { ...n, argument: parsed };
              });
            } catch {
              // ignore parsing errors
            }
          }}
          type="text"
          placeholder="return value"
        />
      </div>
    </BaseBlockLayout>
  );
}
