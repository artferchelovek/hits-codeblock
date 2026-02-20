import type { StatementNode } from "../../types/ast";

export default function ConnectionLine({
  from,
  to,
}: {
  from: StatementNode;
  to: StatementNode;
}) {
  const startX = from.x + 315;
  const startY = from.y + 80;

  const endX = to.x + 1;
  const endY = to.y + 5;

  const offset = (Math.abs(endY - startY) + 50) * 0.2;

  const path = `
    M ${startX} ${startY}
    C ${startX} ${startY + offset},
      ${endX} ${endY - offset},
      ${endX} ${endY}
  `;

  return <path d={path} stroke="rgb(44 99 139)" strokeWidth={3} fill="none" />;
}
