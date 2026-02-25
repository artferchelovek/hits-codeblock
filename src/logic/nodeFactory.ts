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
        nextId: null,
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
        nextId: null,
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
        nextId: null,
      };

    case "If":
      return {
        id: generateId(),
        type: "If",
        condition: {
          type: "BinaryExpression",
          operator: "<=",
          left: {
            type: "Identifier",
            name: "a",
          },
          right: {
            type: "Identifier",
            name: "b",
          },
        },
        x: 100,
        y: 100,
        nextId: null,
        trueId: null,
        falseId: null,
      };
    case "For":
      return {
        id: generateId(),
        type: "For",
        iterator: { type: "Identifier", name: "i" },
        from: { type: "Identifier", name: "15" },
        to: { type: "Identifier", name: "b" },
        x: 100,
        y: 100,
        nextId: null,
        bodyId: null,
      };
    case "StartNode":
      return {
        id: generateId(),
        type: "StartNode",
        x: 100,
        y: 100,
        nextId: null,
      };

    default:
      throw new Error("Unknown node type");
  }
}
