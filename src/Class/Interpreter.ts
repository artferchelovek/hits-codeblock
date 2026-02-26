import type {
  AssignmentNode,
  ExpressionNode,
  ForNode,
  PrintNode,
  ProgramNode,
  StatementNode,
  VariableDeclarationNode,
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class Interpreter {
  private variableData = new VariableActions();
  private blockData: ProgramNode;
  private startNode: StatementNode | undefined;

  private nodeMap: Map<string, StatementNode> = new Map<
    string,
    StatementNode
  >();

  public constructor(blocks: ProgramNode) {
    this.blockData = blocks;
    this.nodeMap = new Map(this.blockData.body.map((node) => [node.id, node]));
    this.startNode = this.blockData.body.find((i) => i.type === "StartNode");
  }

  public *interpreter() {
    if (!this.startNode || !this.startNode.nextId) {
      throw new Error("The starting node was not found");
    }

    let currentNode = this.nodeMap.get(this.startNode.nextId);

    if (currentNode === undefined) {
      throw new Error("The starting node does not point anywhere.");
    }

    while (currentNode) {
      const nextID = this.actionsNode(currentNode);

      const temp = currentNode;

      if (nextID === null) {
        currentNode = undefined;
      } else {
        currentNode = this.nodeMap.get(nextID);
      }
      console.log(this.variableData.getAll());
      if (temp.type === "Print") {
        yield {
          type: temp.type,
          id: temp.id,
          variableAll: this.variableData.getAll(),
          print: Calculate(temp.expression, this.variableData.getAll()),
        };
      } else {
        yield {
          type: temp.type,
          id: temp.id,
          variableAll: this.variableData.getAll(),
        };
      }
    }
  }

  private actionsNode(node: StatementNode): string | null {
    switch (node.type) {
      case "Assignment":
        this.assignment(node);
        return node.nextId;

      case "VariableDeclaration":
        this.declaration(node);
        return node.nextId;

      case "For":
        break;
      case "If":
        break;
      case "Print":
        return node.nextId;
      default:
        return node.nextId;
    }
  }

  private assignment(node: AssignmentNode): void {
    this.variableData.addVariable(
      node.target,
      Calculate(node.value, this.variableData.getMap()),
    );
  }

  private declaration(node: VariableDeclarationNode): void {
    try {
      this.variableData.addVariable(node.name);
    } catch (e) {
      throw new Error(`Unable to declare assignment: `); //???
    }
  }

  private getByiId(node: StatementNode): StatementNode | undefined {
    if (node.nextId && this.nodeMap.has(node.nextId)) {
      return this.nodeMap.get(node.nextId);
    } else {
      return node;
    }
  }
}

const inter = new Interpreter({
  type: "Program",
  name: "NewProgram",
  body: [
    {
      id: "0ca12f62-550d-4e30-a239-8deb2b55c3be",
      type: "VariableDeclaration",
      name: "a",
      x: 2436.265625,
      y: 2174.140625,
      nextId: "a9016a7e-a3b9-4b33-93e3-b903b332cc49",
    },
    {
      id: "a9016a7e-a3b9-4b33-93e3-b903b332cc49",
      type: "Assignment",
      target: "a",
      value: {
        type: "Literal",
        value: 122 + 32,
      },
      x: 2582.6796875,
      y: 2299.1328125,
      nextId: "ed8543f4-d205-4a53-ba71-0a47dcf961d5",
    },
    {
      id: "ed8543f4-d205-4a53-ba71-0a47dcf961d5",
      type: "Print",
      expression: {
        type: "Literal",
        value: 10,
      },
      x: 2738.65625,
      y: 2459.62109375,
      nextId: "882c400f-091e-420a-9982-1d9574538fb0",
    },
    {
      id: "882c400f-091e-420a-9982-1d9574538fb0",
      type: "VariableDeclaration",
      name: "b",
      x: 2809.62109375,
      y: 2573.23828125,
      nextId: "b068ce34-f561-4199-92f8-2fc02b1480ff",
    },
    {
      id: "68895f30-e3cb-4a8c-b66e-f329b708ee7b",
      type: "StartNode",
      x: 2327.3359375,
      y: 2025.98828125,
      nextId: "0ca12f62-550d-4e30-a239-8deb2b55c3be",
    },
    {
      id: "b068ce34-f561-4199-92f8-2fc02b1480ff",
      type: "Assignment",
      target: "b",
      value: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "Identifier",
          name: "a",
        },
        right: {
          type: "Literal",
          value: 1,
        },
      },
      x: 2834.484375,
      y: 2772.66015625,
      nextId: null,
    },
  ],
}).interpreter();

console.log(inter.next());
console.log(inter.next());
console.log(inter.next());
console.log(inter.next());
console.log(inter.next());
