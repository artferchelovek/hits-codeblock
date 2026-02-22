import type { StatementNode } from "../types/ast.ts";
import DeclaringVariable from "../components/shared/Block/DeclaringVariable.tsx";
import Assignment from "../components/shared/Block/Assignment.tsx";
import Print from "../components/shared/Block/Print.tsx";
import If from "../components/shared/Block/If.tsx";

export default function RenderNode({ node }: { node: StatementNode }) {
  switch (node.type) {
    case "VariableDeclaration":
      return <DeclaringVariable node={node} />;
    case "Assignment":
      return <Assignment node={node} />;
    case "Print":
      return <Print node={node} />;
    case "If":
      return <If node={node} />;
    default:
      return <p>{node.type}</p>;
  }
}
