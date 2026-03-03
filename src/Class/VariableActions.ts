import type {
  ArrayNode,
  ExpressionNode,
  VariableForDebug,
} from "../types/ast.ts";
import { Calculate } from "../logic/expressionCount.ts";

export class VariableActions {
  private variableData: Map<string, ExpressionNode>[] = [
    new Map<string, ExpressionNode>(),
  ];

  public constructor() {}

  public newScope() {
    this.variableData.push(new Map<string, ExpressionNode>());
  }
  public workScope() {
    return this.variableData[this.variableData.length - 1];
  }
  public deleteScope() {
    if (this.variableData.length > 1) {
      this.variableData.pop();
    }
  }

  public declareVariable(variableName: string): void {
    const variable = this.workScope().get(variableName);
    if (variable) {
      return;
    }
    this.workScope().set(variableName, { type: "Literal", value: 0 });
  }

  public changeVariable(
    variableName: string,
    variableValue: ExpressionNode,
    index?: ExpressionNode,
  ): void {
    for (let i = this.variableData.length - 1; i >= 0; i--) {
      const variable = this.variableData[i].get(variableName);

      if (variable) {
        if (index && variable?.type === "Array") {
          const indexValue = this.checkAndGetIndex(index, variableName);
          const array = variable as ArrayNode;
          array.value[indexValue] = Calculate(variableValue, this);
          return;
        }

        this.variableData[i].set(
          variableName,
          this.countExpression(variableValue),
        );
        return;
      }
    }

    throw new Error("Variable is not defined");
  }

  public getVariableByName(
    variableName: string,
    index?: ExpressionNode,
  ): ExpressionNode {
    for (let i = this.variableData.length - 1; i >= 0; i--) {
      if (this.variableData[i].has(variableName)) {
        const variable = this.variableData[i].get(variableName);

        if (index && index.type === "Literal") {
          const indexValue = this.checkAndGetIndex(index, variableName);

          if (variable?.type === "Array" && variable) {
            const array = variable as ArrayNode;
            return array.value[indexValue];
          }
        }
        if (variable) {
          return variable;
        }
      }
    }
    throw new Error("Variable is not defined");
  }

  public getAll(): VariableForDebug[] {
    const variables: VariableForDebug[] = [];
    this.variableData.forEach((variable) =>
      variable.forEach((value, name) =>
        variables.push({ type: "VariableForDebug", name: name, value: value }),
      ),
    );

    return variables;
  }

  private checkAndGetIndex(
    index: ExpressionNode,
    variableName: string,
  ): number {
    const variable = this.getVariableByName(variableName);
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
