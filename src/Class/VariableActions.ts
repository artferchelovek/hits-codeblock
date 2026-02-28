import type {
  ArrayNode,
  ExpressionNode,
  VariableForDebug,
} from "../types/ast.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class VariableActions {
  private variableData = new Map<string, ExpressionNode>();

  public constructor() {}

  public declareVariable(variableName: string): void {
    const variable = this.variableData.get(variableName);
    if (variable) {
      throw new Error("Variable already declared");
    }
    this.variableData.set(variableName, { type: "Literal", value: 0 });
  }

  public changeVariable(
    variableName: string,
    variableValue: ExpressionNode,
    index?: ExpressionNode,
  ): void {
    const variable = this.variableData.get(variableName);

    if (variable) {
      if (index && variable?.type === "Array") {
        const indexValue = this.checkAndGetIndex(index, variableName);
        const array = variable as ArrayNode;

        array.value[indexValue] = Calculate(variableValue, this);
        return;
      }

      this.variableData.set(variableName, this.countExpression(variableValue));
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
        const indexValue = this.checkAndGetIndex(index, variableName);

        if (variable?.type === "Array" && variable) {
          const array = variable as ArrayNode;
          return array.value[indexValue];
        }
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

  private checkAndGetIndex(
    index: ExpressionNode,
    variableName: string,
  ): number {
    const variable = this.variableData.get(variableName);
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
    return indexValue;
  }

  private countExpression(node: ExpressionNode): ExpressionNode {
    if (node.type === "Array") {
      return {
        type: "Array",
        value: node.value.map((item) => Calculate(item, this)),
      };
    }
    return Calculate(node, this);
  }
}
