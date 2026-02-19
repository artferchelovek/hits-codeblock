import type { AssignmentNode } from "../../../types/ast.ts";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext.tsx";

export default function Assignment({ node }: { node: AssignmentNode }) {
  const { updateStatement } = useBlockContext();

  return (
    <div className={styles.content} key={node.id}>
      <input
        onChange={(e) => {
          updateStatement(node.id, (n) => {
            if (n.type === "Assignment") {
              return {
                ...n,
                target: e.target.value,
              };
            }
            return n;
          });
        }}
        value={node.target}
        className={styles.assigmentInput}
        type="text"
        placeholder="a"
      />
      <p>=</p>
      <input
        onChange={(e) => {
          updateStatement(node.id, (n) => {
            if (n.type === "Assignment") {
              return {
                ...n,
                value: {
                  type: "Literal",
                  value: Number(e.target.value),
                },
              };
            }
            return n;
          });
        }}
        value={node.value.type === "Literal" ? node.value.value : ""}
        className={styles.assigmentInput}
        type="text"
        placeholder="10"
      />
    </div>
  );
}
