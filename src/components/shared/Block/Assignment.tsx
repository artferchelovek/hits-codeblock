import type { AssignmentNode } from "../../../types/ast";
import styles from "./Block.module.css";
import { useBlockContext } from "../../../context/BlockContext";
import {
  renderExpression,
  stringToExpression,
} from "../../../logic/expression.ts";

export default function Assignment({ node }: { node: AssignmentNode }) {
  const { updateStatement } = useBlockContext();

  return (
    <div className={styles.block}>
      <div className={styles.label}>
        <p className={styles.labelP}>{node.type}</p>
      </div>

      <div className={styles.content}>
        <input
          onChange={(e) => {
            updateStatement(node.id, (n) => {
              if (n.type !== "Assignment") return n;

              return {
                ...n,
                target: e.target.value,
              };
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
              if (n.type !== "Assignment") return n;

              try {
                return {
                  ...n,
                  value: stringToExpression(e.target.value),
                };
              } catch {
                return n;
              }
            });
          }}
          value={renderExpression(node.value)}
          className={styles.assigmentInput}
          type="text"
          placeholder="10"
        />
      </div>
    </div>
  );
}
