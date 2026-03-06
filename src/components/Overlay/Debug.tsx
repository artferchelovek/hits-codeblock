import styles from "./Debug.module.css";

export default function DebugInterface() {
  return (
    <div className={styles.debug}>
      <p className={styles.label}>Debug mode</p>
    </div>
  );
}
