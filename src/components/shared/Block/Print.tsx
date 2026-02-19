import type { PrintNode } from "../../../types/ast.ts";
import styles from "./Block.module.css";

export default function Print({ node }: { node: PrintNode }) {
  return (
    <div className={styles.content} key={node.id}>
      <input
        value={
          node.expression.type === "Literal"
            ? node.expression.value
            : node.expression.type === "Identifier"
              ? node.expression.name
              : ""
        }
        type="text"
        placeholder="a,b,c"
      />
    </div>
  );
}
