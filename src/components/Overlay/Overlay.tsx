import styles from "./Overlay.module.css";
import { useDraggable, DragOverlay, useDndContext } from "@dnd-kit/core";
import { useProgramContext } from "../../context/ProgramContext.tsx";
import { useCompileContext } from "../../context/CompileContext.tsx";
import Terminal from "./Terminal.tsx";
import DebugInterface from "./Debug.tsx";
import Topper from "./Topper.tsx";
import { useProgramRunner } from "../../hooks/useProgramRunner.ts";
import { useState } from "react";
import SvgCategoryGeneral from "../../svg/SvgCategoryGeneral.tsx";
import SvgCategoryVariables from "../../svg/SvgCategoryVariables.tsx";
import SvgCategoryControl from "../../svg/SvgCategoryControl.tsx";
import SvgCategoryFunctions from "../../svg/SvgCategoryFunctions.tsx";
import React from "react";

type Category = "general" | "variables" | "control" | "functions";

const CATEGORIES: { id: Category; label: string; icon: React.FC<any> }[] = [
  { id: "general", label: "General", icon: SvgCategoryGeneral },
  { id: "variables", label: "Variables", icon: SvgCategoryVariables },
  { id: "control", label: "Control", icon: SvgCategoryControl },
  { id: "functions", label: "Functions", icon: SvgCategoryFunctions },
];

const BLOCKS_BY_CATEGORY: Record<Category, string[]> = {
  general: ["StartNode", "Print"],
  variables: ["VariableDeclaration", "Assignment"],
  control: ["If", "For", "While", "BreakNode"],
  functions: ["FunctionDeclaration", "Call", "Return", "getSize"],
};

export default function Overlay() {
  const { compilator } = useCompileContext();
  const { program } = useProgramContext();
  const { active } = useDndContext();

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

      <DragOverlay dropAnimation={null}>
        {active && String(active.id).startsWith("palette-") ? (
          <div className={styles.blockItem} style={{ cursor: "grabbing", boxShadow: "var(--md-sys-elevation-level4)" }}>
            {active.data.current?.type}
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
}

const Palette = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("general");

  return (
    <div className={styles.paletteContainer}>
      <div className={styles.navigation}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`${styles.navItem} ${activeCategory === cat.id ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <div className={styles.iconContainer}>
              <cat.icon fill="currentColor" width={24} height={24} />
            </div>
            <p>{cat.label}</p>
          </div>
        ))}
      </div>
      <div className={styles.blocks}>
        {BLOCKS_BY_CATEGORY[activeCategory].map((type) => (
          <DraggableBlock key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

const DraggableBlock = ({ type }: { type: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className={styles.blockItem}
    >
      {type}
    </div>
  );
};


