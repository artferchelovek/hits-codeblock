import type { StartNode } from "../../../types/ast.ts";
import BaseBlockLayout from "./BaseBlockLayout.tsx";

export default function StartNode({ node }: { node: StartNode }) {
  return (
    <BaseBlockLayout node={node}>
      <p
        style={{
          color: "var(--md-sys-color-on-secondary-container)",
        }}
      >
        Node needs to start program
      </p>
    </BaseBlockLayout>
  );
}
