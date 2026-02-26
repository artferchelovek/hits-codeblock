import { VariableActions } from "./VariableActions.ts";
import type { ForNode } from "../types/ast.ts";
import type { Interpreter } from "./Interpreter.ts";

export class ForActions {
  private iterator: number;
  private variableFor = new VariableActions();
  private from: number;
  private to: number;
  private global: Interpreter;

  constructor(node: ForNode, global: Interpreter) {
    this.iterator = node.iterator;
    this.from = node.from;
    this.to = node.to;
    this.global = global;
  }

  public *activate(node: ForNode): {};

  private exitNode(node: ForNode): {};
}
