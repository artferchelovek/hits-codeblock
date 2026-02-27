import type {
  ArrayNode,
  ExpressionNode,
  VariableForDebug,
} from "../types/ast.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class VariableActions {
  private variableData = new Map<string, ExpressionNode>();

  public constructor() {}

  public addVariable(
    variableName: string,
    variableValue?: ExpressionNode,
  ): void {
    if (variableValue) {
      if (variableValue.type === "Array") {
        variableValue = {
          type: "Array",
          value: variableValue.value.map((item) => Calculate(item, this)),
        };
        this.variableData.set(variableName, variableValue);
        return;
      }
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

  public getVariableByName(
    variableName: string,
    index?: ExpressionNode,
  ): ExpressionNode | undefined {
    if (this.variableData.has(variableName)) {
      const variable = this.variableData.get(variableName);
      if (index) {
        const indexValue = Calculate(index, this).value;

        if (typeof indexValue !== "number") {
          throw new Error(`Indices must be number`);
        }
        if (variable?.type !== "Array") {
          throw new Error(`Variable ${variableName} does not array`);
        }
        if (!(indexValue >= 0 && indexValue < variable.value.length)) {
          throw new Error(`Array index out of bounds`);
        }

        return variable.value[indexValue];
      }
      return variable;
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
    return new Map<string, ExpressionNode>(this.variableData);
  }
}
