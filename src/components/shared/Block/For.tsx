import type { ForNode } from "../../../types/ast.ts";
import TripleBlockLayout from "./TripleBlockLayout.tsx";

export default function For({ node }: { node: ForNode }) {
  return (
    <TripleBlockLayout node={node}>
      <input type="text" />
      <p>&rarr;</p>
      <input type="text" />
      <p>:</p>
      <input type="text" />
    </TripleBlockLayout>
  );
}
