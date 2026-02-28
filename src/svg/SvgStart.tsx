interface SvgStartProps {
  width?: number;
  height?: number;
  fill: string;
}

export default function SvgStart({
  width = 11,
  height = 14,
  fill,
}: SvgStartProps) {
  return (
    <svg
      style={{ padding: "5px" }}
      width={width}
      height={height}
      viewBox="0 0 11 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 14V0L11 7L0 14Z" fill={fill} />
    </svg>
  );
}
