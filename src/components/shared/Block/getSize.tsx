import BaseBlockLayout from "./BaseBlockLayout.tsx";

import type { GetSizeNode } from "../../../types/ast.ts";

import { useProgramContext } from "../../../context/ProgramContext.tsx";
import { useEffect, useState } from "react";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";

export default function GetSize({ node }: { node: GetSizeNode }) {
  const { updateStatement } = useProgramContext();
  const [target, setTarget] = useState<string>("");
  const [object, setObject] = useState<string>("");

  useEffect(() => {
    setTarget(renderExpression(node.target));
    setObject(renderExpression(node.object));
  }, [node.target, node.object]);
  return (
    <BaseBlockLayout node={node}>
      <input
        value={target}
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          setTarget(value);
          try {
            const parsed = stringToExpression(value);

            if (parsed.type === "Identifier") {
              updateStatement(node.id, (n) => {
                if (n.type !== "getSize") return n;

                return {
                  ...n,
                  target: parsed,
                };
              });
            }
          } catch {}
        }}
      />
      <p>&larr;</p>
      <input
        onChange={(e) => {
          const value = e.target.value;
          setObject(value);
          try {
            const parsed = stringToExpression(value);

            updateStatement(node.id, (n) => {
              if (n.type !== "getSize") return n;

              return {
                ...n,
                object: parsed,
              };
            });
          } catch {}
        }}
        value={object}
        type="text"
      />
    </BaseBlockLayout>
  );
}
