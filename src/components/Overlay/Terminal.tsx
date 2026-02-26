import styles from "./Overlay.module.css";
import type { Compilator } from "../../context/CompileContext.tsx";
import { renderExpression } from "../../logic/expression.ts";

export default function Terminal({ compilator }: { compilator: Compilator }) {
  return (
    <div className={styles.terminal}>
      <p className={styles.terminalLabel}>CodeSheLL</p>
      {compilator.printable.map((elem) => (
        <p>{renderExpression(elem)}</p>
      ))}
    </div>
  );
}
