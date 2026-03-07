import type {
  ArrayNode,
  ExpressionNode,
  LiteralNode,
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

  public declareVariable(variableName: string, size?: ExpressionNode): void {
    const variable = this.workScope().get(variableName);
    const regVariable = /^[a-zA-Zа-яА-Я_][a-zA-Zа-яА-Я0-9_]*$/;

    if (variable) {
      throw new Error(`Variable already declared: ${variableName}`);
    }

    if (regVariable.test(variableName)) {
      if (size) {
        const arr: ExpressionNode[] = [];
        const sizeArray = Calculate(size, this) as LiteralNode;
        if (!Number.isInteger(sizeArray.value)) {
          throw new Error("Size must be an integer");
        }
        for (let i = 0; i < sizeArray.value; i++) {
          arr.push({ type: "Literal", value: 0 });
        }
        this.workScope().set(variableName, { type: "Array", value: arr });
        return;
      }
      this.workScope().set(variableName, { type: "Literal", value: 0 });
      return;
    }

    throw new Error("Unsupported variable name: " + variableName);
  }

  public changeVariable(
    variableName: string,
    variableValue: ExpressionNode,
    index?: ExpressionNode,
  ): void {
    for (let i = this.variableData.length - 1; i >= 0; i--) {
      const variable = this.variableData[i].get(variableName);

      if (variable) {
        if (variable.type !== "Array" && variableValue.type === "Array") {
          throw new Error(`Variable "${variableName}" does not array: `);
        }

        if (index && variable.type === "Array") {
          const indexValue = this.checkAndGetIndex(index, variableName);
          const array = variable as ArrayNode;
          array.value[indexValue] = Calculate(variableValue, this);
          return;
        }

        if (variableValue.type === "Array" && variable.type === "Array") {
          if (variable.value.length >= variableValue.value.length) {
            const newArray = variable.value;
            for (let i = 0; i < variableValue.value.length; i++) {
              newArray[i] = variableValue.value[i];
            }
            variableValue = { type: "Array", value: newArray };
          } else {
            throw new Error("Excess elements in array initializer");
          }
        }

        this.variableData[i].set(
          variableName,
          this.countExpression(variableValue),
        );
        return;
      }
    }

    throw new Error(`Variable "${variableName}" is not defined `);
  }

  public getVariableByName(
    variableName: string,
    index?: ExpressionNode,
  ): ExpressionNode {
    for (let i = this.variableData.length - 1; i >= 0; i--) {
      if (this.variableData[i].has(variableName)) {
        const variable = this.variableData[i].get(variableName);

        if (index) {
          const indexValue = this.checkAndGetIndex(index, variableName);
          let indexElem: ExpressionNode;
          if (
            variable &&
            (variable.type === "Array" || variable.type === "String")
          ) {
            indexElem =
              variable.type === "Array"
                ? variable.value[indexValue]
                : { type: "String", value: variable.value[indexValue] };

            return indexElem;
          }
        }
        if (variable) {
          return variable;
        }
      }
    }
    throw new Error(`Variable "${variableName}" is not defined`);
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

    if (typeof indexValue !== "number" || !Number.isInteger(indexValue)) {
      throw new Error(`Indices must be integer number`);
    }
    if (variable?.type !== "Array" && variable?.type !== "String") {
      throw new Error(`Variable "${variableName}" does not array`);
    }
    if (!(indexValue >= 0 && indexValue < variable.value.length)) {
      throw new Error(`${variable.type} index out of range`);
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
