import type { ActiveLine } from "./EditorSpace.tsx";

export default function ActiveLine({ connection }: { connection: ActiveLine }) {
  if (!connection) return;

  const startX = connection.from.x + 315;
  const startY = connection.from.y + 80;

  const endX = connection.toX + 1;
  const endY = connection.toY + 5;

  const offset = Math.abs(endY - startY) * 0.5;

  const path = `
    M ${startX} ${startY}
    C ${startX} ${startY + offset},
      ${endX} ${endY - offset},
      ${endX} ${endY}
  `;
  return (
    <path d={path} stroke="rgb(204 229 255)" strokeWidth={3} fill="none" />
  );
}
