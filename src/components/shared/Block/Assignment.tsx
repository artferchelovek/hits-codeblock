import BaseNodeLayout from "./BaseBlockLayout.tsx";
import { useBlockContext } from "../../../context/BlockContext";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression";
import { useEffect, useState } from "react";
import type { AssignmentNode } from "../../../types/ast.ts";

export default function Assignment({ node }: { node: AssignmentNode }) {
  const [inputValue, setInputValue] = useState(renderExpression(node.value));

  const { updateStatement } = useBlockContext();

  useEffect(() => {
    setInputValue(renderExpression(node.value));
  }, [node.value]);

  return (
    <BaseNodeLayout node={node}>
      <input
        onChange={(e) => {
          updateStatement(node.id, (n) => ({
            ...n,
            target: e.target.value,
          }));
        }}
        value={node.target}
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

            updateStatement(node.id, (n) => ({
              ...n,
              value: parsed,
            }));
          } catch {}
        }}
        value={inputValue}
        type="text"
        placeholder="10"
      />
    </BaseNodeLayout>
  );
}
