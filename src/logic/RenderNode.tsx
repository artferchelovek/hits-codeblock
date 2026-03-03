import type { StatementNode } from "../types/ast.ts";
import DeclaringVariable from "../components/shared/Block/DeclaringVariable.tsx";
import Assignment from "../components/shared/Block/Assignment.tsx";
import Print from "../components/shared/Block/Print.tsx";
import If from "../components/shared/Block/If.tsx";
import For from "../components/shared/Block/For.tsx";
import StartNode from "../components/shared/Block/StartNode.tsx";
import BreakNode from "../components/shared/Block/BreakNode.tsx";
import While from "../components/shared/Block/While.tsx";

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
    case "For":
      return <For node={node} />;
    case "While":
      return <While node={node} />;
    case "StartNode":
      return <StartNode node={node} />;
    case "BreakNode":
      return <BreakNode node={node} />;
    default:
      return <p>мяу</p>;
  }
}
