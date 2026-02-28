import type {
  AssignmentNode,
  ProgramNode,
  StatementNode,
  VariableDeclarationNode,
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class Interpreter {
  private variableData = new VariableActions();
  private blockData: ProgramNode;
  readonly startNode: StatementNode | undefined;

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

      if (nextID === null || nextID === undefined) {
        currentNode = undefined;
      } else {
        currentNode = this.nodeMap.get(nextID);
      }

      if (temp.type === "Print") {
        yield {
          type: temp.type,
          id: temp.id,
          variableAll: this.variableData.getAll(),
          print: Calculate(temp.expression, this.variableData),
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

  private actionsNode(node: StatementNode): string | undefined | null {
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
    if (typeof node.target !== "string") {
      const index = node.target.index;
      const name =
        node.target.object.type === "Identifier" ? node.target.object.name : "";

      this.variableData.changeVariable(name, node.value, index);
      return;
    }

    if (node.value.type === "Array") {
      this.variableData.changeVariable(node.target, node.value);
      return;
    }

    this.variableData.changeVariable(node.target, node.value);
  }

  private declaration(node: VariableDeclarationNode): void {
    try {
      this.variableData.declareVariable(node.name);
    } catch (e) {
      throw new Error(`Unable to declare assignment: `); //???
    }
  }
}
