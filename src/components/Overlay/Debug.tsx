import styles from "./Debug.module.css";
import type { VariableForDebug } from "../../types/ast";
import { renderExpression } from "../../logic/expression";

interface DebugInterfaceProps {
  variables: VariableForDebug[];
}

export default function DebugInterface({ variables }: DebugInterfaceProps) {
  return (
    <div className={styles.debug}>
      <div className={styles.header}>
        <h3 className={styles.title}>Variables</h3>
      </div>

      <div className={styles.gridContainer}>
        {variables.length === 0 ? (
          <div className={styles.empty}>No variables in scope</div>
        ) : (
          variables.map((v, index) => (
            <div key={v.name + index} className={styles.gridRow}>
              <p className={styles.varName}>{v.name}</p>
              <p className={styles.separator}>=</p>
              <p className={styles.varValue}>{renderExpression(v.value)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
