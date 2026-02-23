interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
}

export default function ConnectionLine({
  startX,
  startY,
  endX,
  endY,
  color = "rgb(44 99 139)",
}: ConnectionLineProps) {
  const dx = Math.abs(endX - startX);
  const offset = Math.min(dx * 0.5, 100);

  const path = `
    M ${startX} ${startY}
    C ${startX + offset} ${startY},
      ${endX - offset} ${endY},
      ${endX} ${endY}
  `;

  return (
    <path
      d={path}
      stroke={color}
      strokeWidth={3}
      fill="none"
      style={{ transition: "stroke 0.2s" }}
    />
  );
}
