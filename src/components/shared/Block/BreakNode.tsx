import type { BreakNode } from "../../../types/ast.ts";
import BaseBlockLayout from "./BaseBlockLayout.tsx";

export default function BreakNode({ node }: { node: BreakNode }) {
  return (
    <BaseBlockLayout node={node}>
      <p
        style={{
          color: "var(--md-sys-color-on-secondary-container)",
        }}
      >
        Node needs to stop while/for
      </p>
    </BaseBlockLayout>
  );
}
