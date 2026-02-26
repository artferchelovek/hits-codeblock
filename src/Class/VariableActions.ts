import type {
  ExpressionNode,
  StatementNode,
  VariableForDebug,
} from "../types/ast.ts";
import { Calculate } from "../logic/expressionCount.ts";

// @ts-ignore
export class VariableActions {
  private variableData = new Map<string, ExpressionNode>();

  public constructor() {}

  public addVariable(
    variableName: string,
    variableValue?: ExpressionNode,
  ): void {
    if (variableValue) {
      if (this.variableData.has(variableName)) {
        this.variableData.set(variableName, variableValue);
      } else {
        throw new Error(`Declare the variable ${variableName}`);
      }
    } else {
      this.variableData.set(variableName, { type: "Literal", value: 0 });
    }

    return;
  }

  public changeVariable(
    variableName: string,
    variableValue: ExpressionNode,
  ): void {
    if (this.variableData.has(variableName)) {
      this.variableData.set(variableName, variableValue);
    } else {
      throw new Error("Variable is not defined");
    }
  }

  public getVariableByName(variableName: string): ExpressionNode | undefined {
    if (this.variableData.has(variableName)) {
      return this.variableData.get(variableName);
    } else {
      throw new Error("Variable is not defined");
    }
  }

  public getAll(): VariableForDebug[] {
    const variables: VariableForDebug[] = [];
    this.variableData.forEach((value, name) => {
      variables.push({ type: "VariableForDebug", name: name, value: value });
    });
    return variables;
  }

  public getMap() {
    return new Map<string, ExpressionNode[]>(this.variableData);
  }
}
