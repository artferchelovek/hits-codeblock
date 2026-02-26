import type { ExpressionNode, LiteralNode, StringNode } from "../types/ast.ts";
import type { VariableActions } from "../Class/VariableActions.ts";

function add(first_exp: any, last_exp: any): number | string | boolean {
  if (typeof first_exp === typeof last_exp) {
    return first_exp + last_exp;
  } else {
    return "error";
  }
}

function subtract(first_exp: any, last_exp: any): number | string | boolean {
  if (typeof first_exp === typeof last_exp && typeof last_exp === "number") {
    return first_exp - last_exp;
  } else {
    return "error";
  }
}

function multiply(first_exp: any, last_exp: any): number | string | boolean {
  if (typeof first_exp === typeof last_exp && typeof last_exp === "number") {
    return first_exp * last_exp;
  } else {
    return "error";
  }
}

function modulo(a: any, b: any): number | string {
  if (Number(b) === 0) {
    return "error";
  }
  return Number(a) % Number(b);
}

function divide(a: any, b: any): number | string {
  if (Number(b) === 0) {
    return "error";
  }
  return Number(a) / Number(b);
}

export function Calculate(
  expression: ExpressionNode,
  variableData: Map<string, ExpressionNode>,
): LiteralNode | StringNode {
  if (expression.type === "Literal") return expression;
  if (expression.type === "String") return expression;
  if (expression.type === "Identifier") {
    const variable = variableData.get(expression.name);
    if (variable?.type === "Literal" || variable?.type === "String") {
      return variable;
    }
  }
  if (expression.type === "BinaryExpression") {
    const left_value = Calculate(expression.left, variableData).value;
    const right_value = Calculate(expression.right, variableData).value;
    let result;

    switch (expression.operator) {
      case "+":
        result = add(left_value, right_value);
        break;
      case "-":
        result = subtract(left_value, right_value);
        break;
      case "*":
        result = multiply(left_value, right_value);
        break;

      case "%":
        result = modulo(left_value, right_value);
        break;

      case "/":
        result = divide(left_value, right_value);
        break;
    }

    if (typeof result === "number") {
      return {
        type: "Literal",
        value: result,
      };
    } else if (typeof result === "string") {
      return {
        type: "String",
        value: result,
      };
    }
  }
  throw new Error("Unrecognized expression");
}
