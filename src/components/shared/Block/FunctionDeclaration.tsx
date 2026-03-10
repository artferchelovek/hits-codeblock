import type { FunctionDeclarationNode } from "../../../types/ast.ts";
import BaseBlockLayout from "./BaseBlockLayout.tsx";
import { useBlockContext } from "../../../context/BlockContext.tsx";
import styles from "./Block.module.css";
import { splitByComma } from "../../../logic/expression.ts";
import { useState, useEffect } from "react";

export default function FunctionDeclaration({
  node,
}: {
  node: FunctionDeclarationNode;
}) {
  const { updateStatement } = useBlockContext();

  const [paramsText, setParamsText] = useState(node.params.join(", "));

  useEffect(() => {
    const currentParams = node.params.join(", ");
    if (
      currentParams !==
      paramsText
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(", ")
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParamsText(currentParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.params]);

  return (
    <BaseBlockLayout node={node}>
      <div className={styles.content}>
        <input
          value={node.name}
          onChange={(e) => {
            const value = e.target.value;
            updateStatement(node.id, (n) => {
              if (n.type !== "FunctionDeclaration") return n;
              return { ...n, name: value };
            });
          }}
          type="text"
          placeholder="Function name"
        />
        <input
          value={paramsText}
          onChange={(e) => {
            const value = e.target.value;
            setParamsText(value);

            const params = splitByComma(value)
              .map((p) => p.trim())
              .filter(Boolean);

            if (JSON.stringify(params) !== JSON.stringify(node.params)) {
              updateStatement(node.id, (n) => {
                if (n.type !== "FunctionDeclaration") return n;
                return { ...n, params };
              });
            }
          }}
          type="text"
          placeholder="arg1, arg2"
        />
      </div>
    </BaseBlockLayout>
  );
}
