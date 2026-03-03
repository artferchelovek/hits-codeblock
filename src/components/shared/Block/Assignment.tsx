import BaseNodeLayout from "./BaseBlockLayout.tsx";
import { useBlockContext } from "../../../context/BlockContext";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression";
import { useEffect, useState } from "react";
import type { AssignmentNode } from "../../../types/ast.ts";

export default function Assignment({ node }: { node: AssignmentNode }) {
  const [targetValue, setTargetValue] = useState(renderExpression(node.target));
  const [inputValue, setInputValue] = useState(renderExpression(node.value));

  const { updateStatement } = useBlockContext();

  useEffect(() => {
    setInputValue(renderExpression(node.value));
    setTargetValue(renderExpression(node.target));
  }, [node.value, node.target]);

  return (
    <BaseNodeLayout node={node}>
      <input
        onChange={(e) => {
          const value = e.target.value;
          setTargetValue(value);

          try {
            const parsed = stringToExpression(value);
            if (parsed.type === "Identifier") {
              updateStatement(node.id, (n) => {
                if (n.type !== "Assignment") {
                  return n;
                }

                return {
                  ...n,
                  target: parsed,
                };
              });
            } else if (parsed.type === "MemberExpression") {
              updateStatement(node.id, (n) => {
                if (n.type !== "Assignment") {
                  return n;
                }

                return { ...n, target: parsed };
              });
            }
          } catch {}
        }}
        value={targetValue}
        type="text"
        placeholder="a"
      />

      <p>=</p>

      <input
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value);

          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "Assignment") {
                return n;
              }

              return {
                ...n,
                value: parsed,
              };
            });
          } catch {}
        }}
        value={inputValue}
        type="text"
        placeholder="10"
      />
    </BaseNodeLayout>
  );
}
