import styles from "./ToolBar.module.css";
import SvgBin from "../../svg/SvgBin.tsx";
import { useBlockContext } from "../../context/BlockContext.tsx";

export default function ToolBar() {
  const { removeProgram } = useBlockContext();
  return (
    <div className={styles.toolBar}>
      <div onClick={() => removeProgram()} className={styles.elem}>
        <SvgBin fill={"rgb(7 75 114)"} />
      </div>
    </div>
  );
}
