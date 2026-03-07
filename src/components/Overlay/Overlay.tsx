import styles from "./Overlay.module.css";
import { useDraggable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext.tsx";
import { useCompileContext } from "../../context/CompileContext.tsx";
import Terminal from "./Terminal.tsx";
import DebugInterface from "./Debug.tsx";
import Topper from "./Topper.tsx";
import { useProgramRunner } from "../../hooks/useProgramRunner.ts";

export default function Overlay() {
  const { compilator } = useCompileContext();
  const { program } = useBlockContext();

  const runner = useProgramRunner();

  return (
    <div className={styles.overlay}>
      <Topper runner={runner} />
      {runner.isDebug ? (
        <DebugInterface variables={runner.debugVariables} />
      ) : (
        <Palette />
      )}
      <Terminal compilator={compilator} program={program} />
    </div>
  );
}

const Palette = () => {
  return (
    <div className={styles.blocks}>
      <DraggableBlock type="StartNode" />
      <DraggableBlock type="VariableDeclaration" />
      <DraggableBlock type="Assignment" />
      <DraggableBlock type="Print" />
      <DraggableBlock type="If" />
      <DraggableBlock type="For" />
      <DraggableBlock type="While" />
      <DraggableBlock type="BreakNode" />
      <DraggableBlock type="getSize" />
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
