import { useEffect, useState } from "react";
import type { VariableDeclarationNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useProgramContext } from "../../../context/ProgramContext.tsx";
import BaseBlockLayout from "./BaseBlockLayout.tsx";
import {
  parseNameAndSize,
  renderExpression,
} from "../../../logic/expression.ts";

export default function DeclaringVariable({
  node,
}: {
  node: VariableDeclarationNode;
}) {
  const { updateStatement } = useProgramContext();

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const displayValue = node.size
      ? `${node.name}(${renderExpression(node.size)})`
      : node.name;
    setInputValue(displayValue);
  }, [node.name, node.size]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const { name, size } = parseNameAndSize(val);

    updateStatement(node.id, (n) => {
      if (n.type !== "VariableDeclaration") return n;

      return {
        ...n,
        name: name,
        size: size,
      };
    });
  };

  return (
    <BaseBlockLayout node={node}>
      <div className={styles.content}>
        <input
          onChange={handleChange}
          value={inputValue}
          type="text"
          placeholder="a или a(10)"
          className={styles.variableInput}
        />
      </div>
    </BaseBlockLayout>
  );
}
