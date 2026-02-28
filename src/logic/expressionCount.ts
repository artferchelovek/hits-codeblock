import type { ExpressionNode, LiteralNode, StringNode } from "../types/ast.ts";
import type { VariableActions } from "../Class/VariableActions.ts";

type CorrectExpression = string | number;

function add(
  first_exp: CorrectExpression,
  last_exp: CorrectExpression,
): number | string {
  if (typeof last_exp === "number" && typeof first_exp === "number") {
    return last_exp + first_exp;
  } else if (last_exp === "string" && typeof first_exp === "string") {
    return first_exp + last_exp;
  }

  throw new Error(`Cannot add ${typeof first_exp} + ${typeof last_exp}`);
}

function subtract(
  first_exp: CorrectExpression,
  last_exp: CorrectExpression,
): number | string {
  if (typeof last_exp === "number" && typeof first_exp === "number") {
    return first_exp - last_exp;
  }

  throw new Error(`Cannot subtract ${typeof first_exp} + ${typeof last_exp}`);
}

function multiply(
  first_exp: CorrectExpression,
  last_exp: CorrectExpression,
): number | string {
  if (typeof last_exp === "number" && typeof first_exp === "number") {
    return first_exp * last_exp;
  }
  throw new Error(`Cannot add ${typeof first_exp} + ${typeof last_exp}`);
}

function modulo(
  first_exp: CorrectExpression,
  last_exp: CorrectExpression,
): number | string {
  if (Number(last_exp) === 0) {
    throw new Error(`Division by zero`);
  }
  if (typeof last_exp === "number" && typeof first_exp === "number") {
    return Number(first_exp) % Number(last_exp);
  }

  throw new Error(`Cannot modulo ${typeof first_exp} + ${typeof last_exp}`);
}

function divide(
  first_exp: CorrectExpression,
  last_exp: CorrectExpression,
): number | string {
  if (Number(last_exp) === 0) {
    throw new Error(`Division by zero`);
  }

  if (typeof last_exp === "number" && typeof first_exp === "number") {
    return Number(first_exp) / Number(last_exp);
  }

  throw new Error(`Cannot divide ${typeof first_exp} + ${typeof last_exp}`);
}

export function Calculate(
  expression: ExpressionNode,
  variableData: VariableActions,
): LiteralNode | StringNode {
  if (expression.type === "Literal") return expression;

  if (expression.type === "String") return expression;

  if (expression.type === "Identifier") {
    const variable = variableData.getVariableByName(expression.name);
    if (variable?.type === "Literal" || variable?.type === "String") {
      return variable;
    }
  }

  if (expression.type === "MemberExpression") {
    const index = expression.index;

    if (expression.object.type === "Identifier") {
      const name = expression.object.name;
      const variable = variableData.getVariableByName(name, index);
      if (variable) {
        return Calculate(variable, variableData);
      }
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
