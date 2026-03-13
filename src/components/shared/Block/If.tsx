import type { IfNode } from "../../../types/ast.ts";
import TripleBlockLayout from "./TripleBlockLayout.tsx";
import { useEffect, useState } from "react";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";
import { useProgramContext } from "../../../context/ProgramContext.tsx";

export default function If({ node }: { node: IfNode }) {
  const { updateStatement } = useProgramContext();

  const [leftCondition, setLeftCondition] = useState(
    renderExpression(node.condition.left),
  );
  const [rightCondition, setRightCondition] = useState(
    renderExpression(node.condition.right),
  );

  useEffect(() => {
    setLeftCondition(renderExpression(node.condition.left));
  }, [node.condition.left]);

  useEffect(() => {
    setRightCondition(renderExpression(node.condition.right));
  }, [node.condition.right]);

  const operator = node.condition.operator;

  return (
    <TripleBlockLayout node={node}>
      <input
        value={leftCondition}
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          setLeftCondition(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "If") return n;

              return {
                ...n,
                condition: {
                  ...n.condition,
                  left: parsed,
                },
              };
            });
          } catch { /* empty */ }
        }}
      />
      <select
        value={operator}
        onChange={(e) => {
          const newOperator = e.target.value as
            | ">"
            | "<"
            | ">="
            | "<="
            | "=="
            | "&&"
            | "||";
          try {
            updateStatement(node.id, (n) => {
              if (n.type !== "If") return n;

              return {
                ...n,
                condition: {
                  ...n.condition,
                  operator: newOperator,
                },
              };
            });
          } catch { /* empty */ }
        }}
      >
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
        <option value=">=">&ge;</option>
        <option value="<=">&le;</option>
        <option value="&&">&&</option>
        <option value="||">||</option>
        <option value="==">==</option>
      </select>
      <input
        value={rightCondition}
        onChange={(e) => {
          const value = e.target.value;
          setRightCondition(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "If") return n;

              return {
                ...n,
                condition: {
                  ...n.condition,
                  right: parsed,
                },
              };
            });
          } catch { /* empty */ }
        }}
        type="text"
      />
    </TripleBlockLayout>
  );
}
