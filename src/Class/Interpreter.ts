import type {
  AssignmentNode,
  ExpressionNode,
  ForNode,
  ProgramNode,
  StatementNode,
  VariableDeclarationNode,
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";

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
      this.actionsNode(currentNode);

      yield {
        type: currentNode.type,
        id: currentNode.id,
        variableAll: this.variableData.getAll(),
      };

      if (!currentNode.nextId) {
        break;
      }

      currentNode = this.nodeMap.get(currentNode.nextId);
    }
  }

  private actionsNode(node: StatementNode) {
    switch (node.type) {
      case "Assignment":
        this.assignment(node);
        break;
      case "VariableDeclaration":
        this.declaration(node);
        break;
      case "For":
        break;
      case "If":
        break;
      case "Print":
        break;
    }
  }
  private assignment(node: AssignmentNode): void {
    this.variableData.addVariable(node.target, node.value);
  }

  private declaration(node: VariableDeclarationNode): void {
    try {
      this.variableData.addVariable(node.name);
    } catch (e) {
      throw new Error(`Unable to declare assignment: `); //???
    }
  }
}

const inter = new Interpreter();
