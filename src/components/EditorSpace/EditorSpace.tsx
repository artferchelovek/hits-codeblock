import { DndContext, useDroppable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import styles from "./EditorSpace.module.css";
import RenderNode from "../../logic/RenderNode";
import { useRef, useState } from "react";
import ConnectionLine from "./ConnectionLine.tsx";
import type { StatementNode } from "../../types/ast.ts";
import ActiveLine from "./ActiveLine.tsx";

export type ActiveLine = {
  from: StatementNode;
  toX: number;
  toY: number;
} | null;

export default function EditorSpace() {
  const { program, updateStatement } = useBlockContext();

  const [activeConnection, setActiveConnection] = useState<ActiveLine>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const { setNodeRef } = useDroppable({
    id: "root",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMouse = useRef({ x: 0, y: 0 });

  function connectNodes(sourceId: string, targetId: string) {
    updateStatement(sourceId, (node) => ({
      ...node,
      nextId: targetId,
    }));

    program.body.forEach((n) => {
      if (n.nextId === targetId && n.id !== sourceId) {
        updateStatement(n.id, (node) => ({
          ...node,
          nextId: null,
        }));
      }
    });
  }

  const dragEnd = (event: { active: any; over: any; delta: any }) => {
    const { active, over, delta } = event;

    if (!active) return;

    if (active.data.current?.type === "node") {
      updateStatement(active.id, (node) => ({
        ...node,
        x: node.x + delta.x,
        y: node.y + delta.y,
      }));
    }

    if (
      active.data.current?.type === "output" &&
      over?.data.current?.type === "input"
    ) {
      connectNodes(active.data.current.nodeId, over.data.current.nodeId);
    }

    if (
      (active.data.current?.type === "output1" ||
        active.data.current?.type === "output2") &&
      over?.data.current?.type === "input"
    ) {
      connectNodes(active.data.current.nodeId, over.data.current.nodeId);
      console.log(active.data.current.nodeId, over.data.current.nodeId);
    }

    setActiveConnection(null);
  };

  const dragMove = (event: { active: any; delta: any }) => {
    const { active, delta } = event;

    if (active.data.current?.type === "output") {
      const sourceId = active.data.current.nodeId;

      const sourceNode = program.body.find((n) => n.id === sourceId);

      if (!sourceNode) return;

      setActiveConnection({
        from: sourceNode,
        toX: sourceNode.x + delta.x + 315,
        toY: sourceNode.y + delta.y + 80,
      });
    }

    if (
      active.data.current?.type === "output2" ||
      active.data.current?.type === "output1"
    ) {
      const sourceId = active.data.current.nodeId;

      const sourceNode = program.body.find((n) => n.id === sourceId);

      if (!sourceNode) return;

      setActiveConnection({
        from: sourceNode,
        toX: sourceNode.x + delta.x + 315,
        toY: sourceNode.y + delta.y + 80,
      });
    }
  };

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 1) return;

    e.preventDefault();
    setIsPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isPanning) return;

    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    setPan((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastMouse.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  return (
    <DndContext
      onDragEnd={dragEnd}
      onDragMove={dragMove}
      onDragCancel={() => setActiveConnection(null)}
    >
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            width: "100%",
            height: "100%",
          }}
        >
          <svg className={styles.connections}>
            {activeConnection && <ActiveLine connection={activeConnection} />}

            {program.body.map((node) => {
              if (!node.nextId) return null;

              const target = program.body.find((n) => n.id === node.nextId);
              if (!target) return null;

              return <ConnectionLine key={node.id} from={node} to={target} />;
            })}
          </svg>

          <div ref={setNodeRef} className={styles.editor}>
            {program.body.map((node) => (
              <RenderNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
