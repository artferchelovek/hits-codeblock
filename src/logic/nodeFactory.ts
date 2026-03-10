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
        x: 0,
        y: 0,
        nextId: null,
      };

    case "Assignment":
      return {
        id: generateId(),
        type: "Assignment",
        target: {
          type: "Identifier",
          name: "",
        },
        value: {
          type: "Literal",
          value: 0,
        },
        x: 0,
        y: 0,
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
        x: 0,
        y: 0,
        nextId: null,
      };

    case "If":
      return {
        id: generateId(),
        type: "If",
        condition: {
          type: "BinaryExpression",
          operator: ">",
          left: {
            type: "Identifier",
            name: "a",
          },
          right: {
            type: "Identifier",
            name: "b",
          },
        },
        x: 0,
        y: 0,
        nextId: null,
        trueId: null,
        falseId: null,
      };
    case "For":
      return {
        id: generateId(),
        type: "For",
        iterator: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "Literal",
            value: 1,
          },
        },
        from: {
          type: "BinaryExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "Literal",
            value: 1,
          },
        },
        to: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "Literal",
            value: 10,
          },
        },
        x: 0,
        y: 0,
        nextId: null,
        bodyId: null,
      };
    case "StartNode":
      return {
        id: generateId(),
        type: "StartNode",
        x: 0,
        y: 0,
        nextId: null,
      };
    case "BreakNode":
      return {
        id: generateId(),
        type: "BreakNode",
        x: 0,
        y: 0,
        nextId: null,
      };
    case "While":
      return {
        id: generateId(),
        type: "While",
        condition: {
          type: "BinaryExpression",
          operator: ">",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "Literal",
            value: 1,
          },
        },
        x: 0,
        y: 0,
        nextId: null,
        bodyId: null,
      };
    case "getSize":
      return {
        id: generateId(),
        type: "getSize",
        x: 0,
        y: 0,
        nextId: null,
        target: {
          type: "Identifier",
          name: "",
        },
        object: {
          type: "Identifier",
          name: "",
        },
      };
    case "FunctionDeclaration":
      return {
        id: generateId(),
        type: "FunctionDeclaration",
        name: "",
        params: [],
        x: 0,
        y: 0,
        nextId: null,
      };
    case "Call":
      return {
        id: generateId(),
        type: "Call",
        callee: "",
        args: [],
        x: 0,
        y: 0,
        nextId: null,
      };
    case "Return":
      return {
        id: generateId(),
        type: "Return",
        argument: null,
        x: 0,
        y: 0,
        nextId: null,
      };

    default:
      throw new Error("Unknown node type");
  }
}
