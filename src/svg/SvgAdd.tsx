interface SvgAddProps {
  width?: number;
  height?: number;
  fill: string;
}

export default function SvgAdd({ width = 11, height = 14, fill }: SvgAddProps) {
  return (
    <svg
      style={{ padding: "5px" }}
      width={width}
      height={height}
      viewBox="0 0 11 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill={fill} />
    </svg>
  );
}
