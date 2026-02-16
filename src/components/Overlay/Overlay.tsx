import styles from "./Overlay.module.css";
import SvgStart from "../../svg/SvgStart.tsx";
import SvgStop from "../../svg/SvgStop.tsx";
import Block from "../shared/Block/Block.tsx";
import { blockTypes, type IBlock } from "./blockTypes.ts";

export default function Overlay() {
  return (
    <div className={styles.overlay}>
      <Topper />
      <Blocks />
    </div>
  );
}

const Topper = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.label}>CodeBlocks</div>
      <div className={styles.start}>
        <SvgStart fill="var(--md-sys-color-on-tertiary)" />
      </div>
      <div className={styles.stop}>
        <SvgStop fill={"var(--md-sys-color-on-secondary)"} />
      </div>
    </div>
  );
};

const Blocks = () => {
  return (
    <div className={styles.blocks}>
      {blockTypes.map((element: IBlock) => (
        <Block name={element.name} type={element.type} />
      ))}
    </div>
  );
};
