interface SvgProps {
  width?: number;
  height?: number;
  fill: string;
}

export default function SvgCategoryVariables({ width = 24, height = 24, fill }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox="0 -960 960 960"
      width={width}
      fill={fill}
    >
      <path d="M120-280v-400h720v400H120Zm80-80h560v-240H200v240Zm0 0v-240 240Z" />
    </svg>
  );
}
