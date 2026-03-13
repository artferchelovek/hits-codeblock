import type { CallNode } from "../../../types/ast.ts";
import BaseBlockLayout from "./BaseBlockLayout.tsx";
import { useProgramContext } from "../../../context/ProgramContext.tsx";
import styles from "./Block.module.css";
import {
  renderExpression,
  stringToExpression,
  splitByComma,
} from "../../../logic/expression.ts";
import { useState, useEffect } from "react";

export default function Call({ node }: { node: CallNode }) {
  const { updateStatement } = useProgramContext();

  const [callee, setCallee] = useState(node.callee);
  const [argsValue, setArgsValue] = useState(
    node.args.map(renderExpression).join(", "),
  );

  useEffect(() => {
    const currentArgs = node.args.map(renderExpression).join(", ");
    if (
      currentArgs !==
      argsValue
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
        .join(", ")
    ) {
      setArgsValue(currentArgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.args]);

  return (
    <BaseBlockLayout node={node}>
      <div className={styles.content}>
        <input
          value={callee}
          onChange={(e) => {
            const value = e.target.value;
            setCallee(value);
            updateStatement(node.id, (n) => {
              if (n.type !== "Call") return n;
              return { ...n, callee: value };
            });
          }}
          type="text"
          placeholder="Function name"
        />
        <input
          value={argsValue}
          onChange={(e) => {
            const value = e.target.value;
            setArgsValue(value);
            try {
              const parsedArgs = splitByComma(value)
                .map((s) => s.trim())
                .filter(Boolean)
                .map(stringToExpression);

              if (JSON.stringify(parsedArgs) !== JSON.stringify(node.args)) {
                updateStatement(node.id, (n) => {
                  if (n.type !== "Call") return n;
                  return { ...n, args: parsedArgs };
                });
              }
            } catch {
              // шоб не ругался
            }
          }}
          type="text"
          placeholder="arg1, arg2"
        />
      </div>
    </BaseBlockLayout>
  );
}
