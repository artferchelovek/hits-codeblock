import type { ProgramNode } from "../types/ast.ts";

export default function downloadProgram(program: ProgramNode) {
  const jsonString = JSON.stringify(program, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${program.name}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
