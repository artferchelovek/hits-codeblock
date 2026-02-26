import styles from "./Overlay.module.css";
import SvgStart from "../../svg/SvgStart.tsx";
import SvgStop from "../../svg/SvgStop.tsx";
import { useDraggable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext.tsx";
import { Interpreter } from "../../Class/Interpreter.ts";
import {
  type Compilator,
  useCompileContext,
} from "../../context/CompileContext.tsx";
import Terminal from "./Terminal.tsx";
import type { ExpressionNode } from "../../types/ast.ts";

export default function Overlay() {
  const { compilator, updateStatus, addPrintable, clearPrintable } =
    useCompileContext();
  return (
    <div className={styles.overlay}>
      <Topper
        compilator={compilator}
        updateStatus={updateStatus}
        addPrintable={addPrintable}
        clearPrintable={clearPrintable}
      />
      <Palette />
      <Terminal compilator={compilator} />
    </div>
  );
}

const Topper = ({
  compilator,
  updateStatus,
  addPrintable,
  clearPrintable,
}: {
  compilator: Compilator;
  updateStatus: () => void;
  addPrintable: (node: ExpressionNode) => void;
  clearPrintable: () => void;
}) => {
  const { program } = useBlockContext();

  const startProgram = () => {
    if (compilator) {
      updateStatus();
      clearPrintable();
      try {
        const runtime = new Interpreter(program).interpreter();
        let result = runtime.next();

        while (!result.done) {
          console.log(result.value);
          if (result.value?.type === "Print") addPrintable(result.value.print);
          result = runtime.next();
        }
      } catch (error) {
        console.log(error);
      }
      updateStatus();
    }
  };

  const startProgramSlowly = () => {
    updateStatus();
    clearPrintable();
    try {
      const runtime = new Interpreter(program).interpreter();

      const timer = setInterval(() => {
        const result = runtime.next();
        if (result.done) {
          clearInterval(timer);
        } else {
          if (result.value?.type === "Print") addPrintable(result.value.print);
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.menu}>
      <div className={styles.label}>CodeBlocks</div>
      <div
        className={styles.start}
        onClick={() => {
          startProgram();
        }}
      >
        <SvgStart fill="var(--md-sys-color-on-tertiary)" />
      </div>
      <div
        onClick={() => {
          startProgramSlowly();
        }}
        className={styles.stop}
      >
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
