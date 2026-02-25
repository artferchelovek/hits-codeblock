import type {
  AssignmentNode,
  ExpressionNode,
  ForNode,
  ProgramNode,
  StatementNode,
  VariableDeclarationNode,
} from "../types/ast.ts";
import { VariableActions } from "./VariableActions.ts";
import For from "../components/shared/Block/For.tsx";
import { ForActions } from "./ForActions.ts";

export class Interpreter {
  private variableData = new VariableActions();
  private blockData: ProgramNode;
  private startNode: StatementNode | undefined;

  public constructor(blocks: ProgramNode) {
    this.blockData = blocks;
    this.startNode = this.blockData.body.find((i) => i.type === "StartNode");

    if (!this.startNode || !this.startNode.nextId) {
      throw new Error("The starting node was not found");
    }
  }

  private getById(idForSearch: string): StatementNode | undefined {
    return this.blockData.body.find(
      (node: StatementNode) => node.id === idForSearch,
    );
  }

  public interpreter() {
    let currentNode: StatementNode | undefined = this.blockData.body.find(
      (node: StatementNode) => node.id === this.startNode.nextId,
    );

    if (!currentNode) {
      throw new Error("The starting node does not point anywhere.");
    }

    while (currentNode.nextId !== null) {
      switch (currentNode.type) {
        case "Assignment":
          this.assignment(currentNode);
          break;
        case "VariableDeclaration":
          this.declaration(currentNode);
          break;
        case "For":
          break;
        case "If":
          break;
        case "Print":
          break;
      }
    }
  }

  public assignment(node: AssignmentNode): void {
    this.variableData.addVariable(node.target, node.value);
  }

  public declaration(node: VariableDeclarationNode): void {
    try {
      this.variableData.addVariable(node.name);
    } catch (e) {
      throw new Error(`Unable to declare assignment: `); //???
    }
  }

  public forStatement(node: ForNode): void {
    let actions = ForActions(node);
  }
}
