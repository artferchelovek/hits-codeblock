import styles from "./Overlay.module.css";
import SvgStart from "../../svg/SvgStart.tsx";
import SvgStop from "../../svg/SvgStop.tsx";
import { useDraggable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext.tsx";

export default function Overlay() {
  return (
    <div className={styles.overlay}>
      <Topper />
      <Palette />
    </div>
  );
}

const Topper = () => {
  const { program } = useBlockContext();

  return (
    <div className={styles.menu}>
      <div className={styles.label}>CodeBlocks</div>
      <div
        className={styles.start}
        onClick={() => {
          console.log(JSON.stringify(program, null, 2)); //  debug
        }}
      >
        <SvgStart fill="var(--md-sys-color-on-tertiary)" />
      </div>
      <div className={styles.stop}>
        <SvgStop fill={"var(--md-sys-color-on-secondary)"} />
      </div>
    </div>
  );
};

const Palette = () => {
  return (
    <div className={styles.blocks}>
      <DraggableBlock type="StartNode" />
      <DraggableBlock type="VariableDeclaration" />
      <DraggableBlock type="Assignment" />
      <DraggableBlock type="Print" />
      <DraggableBlock type={"If"} />
      <DraggableBlock type={"For"} />
    </div>
  );
};

const DraggableBlock = ({ type }: { type: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className={styles.blockItem}
    >
      {type}
    </div>
  );
};
