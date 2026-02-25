import { VariableActions } from "./VariableActions.ts";
import type { ForNode, ProgramNode } from "../types/ast.ts";

export class ForActions {
  private iterator: number;
  private variableFor = new VariableActions();
  private from: number;
  private to: number;

  constructor(node: ForNode) {
    this.iterator = node.iterator;
    this.from = node.from;
    this.to = node.to;
  }

  public;
}
