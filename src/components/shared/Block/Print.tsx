import type { PrintNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useProgramContext } from "../../../context/ProgramContext.tsx";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useEffect, useState } from "react";
import BaseBlockLayout from "./BaseBlockLayout.tsx";

export default function Print({ node }: { node: PrintNode }) {
  const { updateStatement } = useProgramContext();

  const [inputValue, setInputValue] = useState(
    renderExpression(node.expression),
  );


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(renderExpression(node.expression));
  }, [node.expression]);

  return (
    <BaseBlockLayout node={node}>
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
            } catch {
              // ignore parsing errors
            }
          }}
          type="text"
          placeholder="a + 5"
        />
      </div>
    </BaseBlockLayout>
  );
}
