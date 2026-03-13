import BaseNodeLayout from "./BaseBlockLayout.tsx";
import { useProgramContext } from "../../../context/ProgramContext.tsx";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression";
import { useEffect, useState } from "react";
import type { AssignmentNode } from "../../../types/ast.ts";

export default function Assignment({ node }: { node: AssignmentNode }) {
  const [targetValue, setTargetValue] = useState("");
  const [inputValue, setInputValue] = useState(renderExpression(node.value));

  const { updateStatement } = useProgramContext();


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

            updateStatement(node.id, (n) => {
              if (n.type !== "Assignment") return n;

              return {
                ...n,
                target: parsed,
              };
            });
          } catch {
            // value is not a valid expression yet
          }
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
          } catch {
            // value is not a valid expression yet
          }
        }}
        value={inputValue}
        type="text"
        placeholder="10"
      />
    </BaseNodeLayout>
  );
}
