import type { VariableDeclarationNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext";
import BaseBlockLayout from "./BaseBlockLayout.tsx";

export default function DeclaringVariable({
  node,
}: {
  node: VariableDeclarationNode;
}) {
  const { updateStatement } = useBlockContext();

  return (
    <BaseBlockLayout node={node}>
      <div className={styles.content}>
        <input
          onChange={(e) => {
            updateStatement(node.id, (n) => {
              if (n.type !== "VariableDeclaration") return n;

              return {
                ...n,
                name: e.target.value,
              };
            });
          }}
          value={node.name}
          type="text"
          placeholder="a"
        />
      </div>
    </BaseBlockLayout>
  );
}
