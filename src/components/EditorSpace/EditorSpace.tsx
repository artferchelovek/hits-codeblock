import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import styles from "./EditorSpace.module.css";
import RenderNode from "../../logic/RenderNode";
import React, { useRef, useState } from "react";
import ConnectionLine from "./ConnectionLine.tsx";
import type { ForNode, IfNode, WhileNode } from "../../types/ast.ts";
import { getConnectorPos } from "../../logic/getConnectorPos.ts";

export type ActiveLineData = {
  startX: number;
  startY: number;
  toX: number;
  toY: number;
} | null;

interface EditorSpaceProps {
  setPanMain: (
    value:
      | ((prevState: { x: number; y: number }) => { x: number; y: number })
      | {
          x: number;
          y: number;
        },
  ) => void;
  panMain: { x: number; y: number };
}

export default function EditorSpace({ setPanMain, panMain }: EditorSpaceProps) {
  const { program, updateStatement } = useBlockContext();

  const [activeConnection, setActiveConnection] =
    useState<ActiveLineData>(null);
  const [isPanning, setIsPanning] = useState(false);

  const { setNodeRef } = useDroppable({
    id: "root",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMouse = useRef({ x: 0, y: 0 });

  function connectNodes(
    sourceId: string,
    targetId: string,
    connectionType: string,
  ) {
    program.body.forEach((n) => {
      updateStatement(n.id, (node) => {
        const newNode = { ...node };
        if (newNode.nextId === targetId) newNode.nextId = null;
        if (node.type === "If") {
          if ((node as IfNode).trueId === targetId)
            (newNode as any).trueId = null;
          if ((node as IfNode).falseId === targetId)
            (newNode as any).falseId = null;
        }
        if (node.type === "For") {
          if ((node as ForNode).bodyId === targetId)
            (newNode as any).bodyId = null;
        }
        if (node.type === "While") {
          if ((node as WhileNode).bodyId === targetId)
            (newNode as any).bodyId = null;
        }
        return newNode;
      });
    });

    updateStatement(sourceId, (node) => {
      if (node.type === "If") {
        if (connectionType === "output1") return { ...node, trueId: targetId };
        if (connectionType === "output2") return { ...node, falseId: targetId };
      }
      if (node.type === "For" || node.type === "While") {
        if (connectionType === "output1") return { ...node, bodyId: targetId };
      }
      return { ...node, nextId: targetId };
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (
      e.button !== 1 &&
      !(e.button === 0 && (e.target as HTMLElement).id === "editor")
    )
      return;

    e.preventDefault();
    setIsPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isPanning) return;

    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    setPanMain((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastMouse.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  const handleWheel = (e: React.WheelEvent) => {
    const dx = e.deltaX;
    const dy = e.deltaY;

    setPanMain((prev) => ({
      x: prev.x - dx,
      y: prev.y - dy,
    }));

    if (setPanMain) {
      setPanMain((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }));
    }
  };

  useDndMonitor({
    onDragMove(event) {
      const { active, delta } = event;
      const type = active.data.current?.type;

      if (["output", "output1", "output2"].includes(type)) {
        const sourceId = active.data.current?.nodeId;
        let connectorId = `out-${sourceId}`;
        if (type === "output1") connectorId = `out-true-${sourceId}`;
        if (type === "output2") connectorId = `out-false-${sourceId}`;

        const startPos = getConnectorPos(connectorId, containerRef);
        if (startPos) {
          setActiveConnection({
            startX: startPos.x - panMain.x,
            startY: startPos.y - panMain.y,
            toX: startPos.x + delta.x - panMain.x,
            toY: startPos.y + delta.y - panMain.y,
          });
        }
      }
    },
    onDragEnd(event) {
      const { active, over } = event;
      const connectionType = active.data.current?.type;
      const isOutput = ["output", "output1", "output2"].includes(
        connectionType,
      );

      if (isOutput && over?.data.current?.type === "input") {
        connectNodes(
          active.data.current?.nodeId,
          over.data.current.nodeId,
          connectionType,
        );
      }
      setActiveConnection(null);
    },
    onDragCancel() {
      setActiveConnection(null);
    },
  });

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      id="editor"
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
          transform: `translate(${panMain.x}px, ${panMain.y}px)`,
          width: "10000px",
          height: "10000px",
          pointerEvents: "none",
          touchAction: "none",
        }}
      >
        <svg
          className={styles.connections}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "10000px",
            height: "10000px",
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {activeConnection && (
            <ConnectionLine
              startX={activeConnection.startX}
              startY={activeConnection.startY}
              endX={activeConnection.toX}
              endY={activeConnection.toY}
              color="rgba(204, 229, 255, 0.6)"
            />
          )}

          {program.body.map((node) => {
            const lines = [];

            if (node.nextId) {
              const start = getConnectorPos(`out-${node.id}`, containerRef);
              const end = getConnectorPos(`input-${node.nextId}`, containerRef);
              if (start && end) {
                lines.push(
                  <ConnectionLine
                    key={`${node.id}-next`}
                    startX={start.x - panMain.x}
                    startY={start.y - panMain.y}
                    endX={end.x - panMain.x}
                    endY={end.y - panMain.y}
                  />,
                );
              }
            }

            if (node.type === "For") {
              const forNode = node as ForNode;

              if (forNode.bodyId) {
                const start = getConnectorPos(
                  `out-true-${node.id}`,
                  containerRef,
                );
                const end = getConnectorPos(
                  `input-${forNode.bodyId}`,
                  containerRef,
                );
                if (start && end) {
                  lines.push(
                    <ConnectionLine
                      key={`${node.id}-true`}
                      startX={start.x - panMain.x}
                      startY={start.y - panMain.y}
                      endX={end.x - panMain.x}
                      endY={end.y - panMain.y}
                      color="green"
                    />,
                  );
                }
              }
            }

            if (node.type === "While") {
              const WhileNode = node as WhileNode;

              if (WhileNode.bodyId) {
                const start = getConnectorPos(
                  `out-true-${node.id}`,
                  containerRef,
                );
                const end = getConnectorPos(
                  `input-${WhileNode.bodyId}`,
                  containerRef,
                );
                if (start && end) {
                  lines.push(
                    <ConnectionLine
                      key={`${node.id}-true`}
                      startX={start.x - panMain.x}
                      startY={start.y - panMain.y}
                      endX={end.x - panMain.x}
                      endY={end.y - panMain.y}
                      color="green"
                    />,
                  );
                }
              }
            }

            if (node.type === "If") {
              const ifNode = node as IfNode;

              if (ifNode.trueId) {
                const start = getConnectorPos(
                  `out-true-${node.id}`,
                  containerRef,
                );
                const end = getConnectorPos(
                  `input-${ifNode.trueId}`,
                  containerRef,
                );
                if (start && end) {
                  lines.push(
                    <ConnectionLine
                      key={`${node.id}-true`}
                      startX={start.x - panMain.x}
                      startY={start.y - panMain.y}
                      endX={end.x - panMain.x}
                      endY={end.y - panMain.y}
                      color="green"
                    />,
                  );
                }
              }

              if (ifNode.falseId) {
                const start = getConnectorPos(
                  `out-false-${node.id}`,
                  containerRef,
                );
                const end = getConnectorPos(
                  `input-${ifNode.falseId}`,
                  containerRef,
                );
                if (start && end) {
                  lines.push(
                    <ConnectionLine
                      key={`${node.id}-false`}
                      startX={start.x - panMain.x}
                      startY={start.y - panMain.y}
                      endX={end.x - panMain.x}
                      endY={end.y - panMain.y}
                      color="red"
                    />,
                  );
                }
              }
            }

            return lines;
          })}
        </svg>

        <div
          ref={setNodeRef}
          className={styles.editor}
          style={{
            width: "10000px",
            height: "10000px",
            position: "absolute",
            pointerEvents: "all",
          }}
        >
          {program.body.map((node) => (
            <RenderNode key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
