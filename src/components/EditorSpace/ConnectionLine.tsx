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
  color = "rgba(80, 150, 255, 0.8)",
}: ConnectionLineProps) {
  const dx = endX - startX;

  const curvature = 0.5;
  const horizontalOffset = Math.max(Math.abs(dx) * curvature, 50);

  const path = `
    M ${startX} ${startY}
    C ${startX + horizontalOffset} ${startY},
      ${endX - horizontalOffset} ${endY},
      ${endX} ${endY}
  `;

  return (
    <g>
      <path
        d={path}
        stroke={color}
        strokeWidth={6}
        fill="none"
        style={{ opacity: 0.15, filter: "blur(2px)" }}
      />

      <path
        d={path}
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        style={{
          transition: "stroke 0.3s ease",
        }}
      />
    </g>
  );
}
