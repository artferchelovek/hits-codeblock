import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useBlockContext } from "../../context/BlockContext";
import styles from "./EditorSpace.module.css";
import RenderNode from "../../logic/RenderNode";
import React, { useEffect, useRef, useState } from "react";
import ConnectionLine from "./ConnectionLine.tsx";
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
  const { program, updateStatement, activeNode } = useBlockContext();
  const [activeConnection, setActiveConnection] =
    useState<ActiveLineData>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isAutoPanning, setIsAutoPanning] = useState(false);
  const [, setDragTick] = useState(0);

  const { setNodeRef } = useDroppable({ id: "root" });

  const containerRef = useRef<HTMLDivElement>(null);
  const movingLayerRef = useRef<HTMLDivElement>(null);

  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (activeNode) {
      const node = program.body.find((n) => n.id === activeNode);
      if (node && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setIsAutoPanning(true);
        setPanMain({
          x: width / 2 - node.x - 150,
          y: height / 2 - node.y - 37.5,
        });

        const timeout = setTimeout(() => setIsAutoPanning(false), 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [activeNode, program.body, setPanMain]);

  function connectNodes(
    sourceId: string,
    targetId: string,
    connectionType: string,
  ) {
    program.body.forEach((n) => {
      updateStatement(n.id, (node) => {
        const newNode = { ...node };
        if (newNode.nextId === targetId) newNode.nextId = null;
        if (newNode.type === "If") {
          if (newNode.trueId === targetId) newNode.trueId = null;
          if (newNode.falseId === targetId) newNode.falseId = null;
        } else if (newNode.type === "For" || newNode.type === "While") {
          if ((newNode as any).bodyId === targetId)
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.button !== 1 &&
      !(e.button === 0 && (e.target as HTMLElement).id === "editor")
    )
      return;
    e.preventDefault();
    setIsPanning(true);
    setIsAutoPanning(false);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setPanMain((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    setIsAutoPanning(false);
    setPanMain((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
  };

  useDndMonitor({
    onDragMove(event) {
      const { active, delta } = event;
      const type = active.data.current?.type;

      if (type === "node") {
        setDragTick((t) => t + 1);
        return;
      }

      if (["output", "output1", "output2"].includes(type)) {
        const sourceId = active.data.current?.nodeId;
        let connectorId = `out-${sourceId}`;
        if (type === "output1") connectorId = `out-true-${sourceId}`;
        if (type === "output2") connectorId = `out-false-${sourceId}`;

        const startPos = getConnectorPos(connectorId, movingLayerRef);
        if (startPos) {
          setActiveConnection({
            startX: startPos.x,
            startY: startPos.y,
            toX: startPos.x + delta.x,
            toY: startPos.y + delta.y,
          });
        }
      }
    },
    onDragEnd(event) {
      const { active, over } = event;

      if (active.data.current?.type === "node") {
        setDragTick(0);
      }

      if (
        ["output", "output1", "output2"].includes(active.data.current?.type) &&
        over?.data.current?.type === "input"
      ) {
        connectNodes(
          active.data.current?.nodeId,
          over.data.current.nodeId,
          active.data.current?.type,
        );
      }
      setActiveConnection(null);
    },
    onDragCancel() {
      setActiveConnection(null);
      setDragTick(0);
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
        backgroundImage: "radial-gradient(#d7d7d7 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundPosition: `${panMain.x}px ${panMain.y}px`,
        transition: isAutoPanning
          ? "background-position 0.4s cubic-bezier(0.2, 0, 0, 1)"
          : "none",
      }}
    >
      <div
        ref={movingLayerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${panMain.x}px, ${panMain.y}px)`,
          width: 0,
          height: 0,
          pointerEvents: "none",
          transition: isAutoPanning
            ? "transform 0.4s cubic-bezier(0.2, 0, 0, 1)"
            : "none",
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
            zIndex: 0,
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
            const renderLink = (
              fromId: string,
              toId: string | null,
              color?: string,
            ) => {
              if (!toId) return null;

              const start = getConnectorPos(fromId, movingLayerRef);
              const end = getConnectorPos(`input-${toId}`, movingLayerRef);

              if (!start || !end) return null;

              return (
                <ConnectionLine
                  key={`${fromId}-${toId}`}
                  startX={start.x}
                  startY={start.y}
                  endX={end.x}
                  endY={end.y}
                  color={color}
                />
              );
            };

            return (
              <React.Fragment key={node.id}>
                {renderLink(`out-${node.id}`, node.nextId)}
                {node.type === "If" && (
                  <>
                    {renderLink(
                      `out-true-${node.id}`,
                      node.trueId,
                      "rgba(52,201,65,0.8)",
                    )}
                    {renderLink(
                      `out-false-${node.id}`,
                      node.falseId,
                      "rgba(201,52,52,0.8)",
                    )}
                  </>
                )}
                {(node.type === "For" || node.type === "While") &&
                  renderLink(
                    `out-true-${node.id}`,
                    (node as any).bodyId,
                    "rgba(146,52,201,0.8)",
                  )}
              </React.Fragment>
            );
          })}
        </svg>

        <div
          className={styles.editor}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "10000px",
            height: "10000px",
            pointerEvents: "all",
          }}
        >
          {program.body.map((node) => (
            <RenderNode key={node.id} node={node} />
          ))}
        </div>
      </div>

      <div
        ref={setNodeRef}
        style={{ position: "absolute", inset: 0, zIndex: -1 }}
      />
    </div>
  );
}
