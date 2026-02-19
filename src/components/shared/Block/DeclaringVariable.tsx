import type { VariableDeclarationNode } from "../../../types/ast.ts";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext.tsx";

export default function DeclaringVariable({
  node,
}: {
  node: VariableDeclarationNode;
}) {
  const { updateStatement } = useBlockContext();

  return (
    <div className={styles.content} key={node.id}>
      <input
        onChange={(e) => {
          updateStatement(node.id, (n) => {
            return { ...n, name: e.target.value };
          });
        }}
        value={node.name}
        type="text"
        placeholder="a,b,c"
      />
    </div>
  );
}
