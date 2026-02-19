import type { StatementNode } from "../types/ast";

function generateId() {
  return crypto.randomUUID();
}

export function createNode(type: string): StatementNode {
  switch (type) {
    case "VariableDeclaration":
      return {
        id: generateId(),
        type: "VariableDeclaration",
        name: "",
        x: 100,
        y: 100,
      };

    case "Assignment":
      return {
        id: generateId(),
        type: "Assignment",
        target: "",
        value: {
          type: "Literal",
          value: 0,
        },
        x: 100,
        y: 100,
      };

    case "Print":
      return {
        id: generateId(),
        type: "Print",
        expression: {
          type: "Literal",
          value: 0,
        },
        x: 100,
        y: 100,
      };

    default:
      throw new Error("Unknown node type");
  }
}
