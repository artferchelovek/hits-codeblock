import styles from "./Overlay.module.css";
import type { Compilator } from "../../context/CompileContext.tsx";
import type { ProgramNode } from "../../types/ast.ts";

export default function Terminal({
  compilator,
  program,
}: {
  compilator: Compilator;
  program: ProgramNode;
}) {
  return (
    <div className={styles.terminal}>
      <p className={styles.terminalLabel}>CodeSheLL</p>
      <textarea
        readOnly
        className={styles.terminalOutput}
        value={`codeshell/${program.name}.cshl\n${compilator.printable
          .map((elem) => `${elem}`)
          .join("\n")}`}
      ></textarea>
    </div>
  );
}
