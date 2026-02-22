import type { ExpressionNode } from "../types/ast.ts";

export function stringToExpression(expression: string): ExpressionNode {
  let current = expression.replace(/\s+/g, "");

  const regNumber = /^-?\d+$/;
  const regVariable = /^[a-zA-Z]+$/;

  if (current[0] === "(" && current[current.length - 1] === ")") {
    let depth = 0;
    let isWrapped = true;

    for (let i = 0; i < current.length - 1; i++) {
      if (current[i] === "(") depth++;
      if (current[i] === ")") depth--;

      if (depth === 0) {
        isWrapped = false;
        break;
      }
    }

    if (isWrapped) {
      current = current.slice(1, -1);
    }
  }

  if (regNumber.test(current)) {
    return {
      type: "Literal",
      value: Number(current),
    };
  }

  if (regVariable.test(current)) {
    return {
      type: "Identifier",
      name: current,
    };
  }

  let stack: string[] = [];
  let minPriority = Infinity;
  let operatorIndex = -1;
  let foundOperator = "";

  for (let i = 0; i < current.length; i++) {
    const char = current[i];

    if (char === "(") {
      stack.push(char);
      continue;
    }

    if (char === ")") {
      stack.pop();
      continue;
    }

    if (stack.length === 0) {
      if (i < current.length - 1) {
        const twoCharOp = current.substring(i, i + 2);
        if ([">=", "<=", "=="].includes(twoCharOp)) {
          const priority = getPriority(twoCharOp);
          if (priority <= minPriority) {
            minPriority = priority;
            operatorIndex = i;
            foundOperator = twoCharOp;
          }
          i++;
          continue;
        }
      }

      if ("+-*/><".includes(char)) {
        const priority = getPriority(char);
        if (priority <= minPriority) {
          minPriority = priority;
          operatorIndex = i;
          foundOperator = char;
        }
      }
    }
  }

  if (operatorIndex !== -1) {
    const left = current.slice(0, operatorIndex);
    const right = current.slice(operatorIndex + foundOperator.length);

    return {
      type: "BinaryExpression",
      operator: foundOperator as
        | "+"
        | "-"
        | "*"
        | "/"
        | "%"
        | ">"
        | "<"
        | ">="
        | "<="
        | "==",
      left: stringToExpression(left),
      right: stringToExpression(right),
    };
  }

  throw new Error("Invalid expression: " + expression);
}

function getPriority(operator: string): number {
  switch (operator) {
    case ">":
    case "<":
    case ">=":
    case "<=":
    case "==":
      return 3;

    case "*":
    case "/":
      return 2;

    case "+":
    case "-":
      return 1;

    default:
      return 0;
  }
}

export function renderExpression(expr: ExpressionNode): string {
  switch (expr.type) {
    case "Literal":
      return String(expr.value);

    case "Identifier":
      return expr.name;

    case "BinaryExpression": {
      const left = expr.left;
      const right = expr.right;

      const currentPriority = getPriority(expr.operator);

      let leftStr = renderExpression(left);
      let rightStr = renderExpression(right);

      if (
        left.type === "BinaryExpression" &&
        getPriority(left.operator) < currentPriority
      ) {
        leftStr = `(${leftStr})`;
      }

      if (
        right.type === "BinaryExpression" &&
        getPriority(right.operator) < currentPriority
      ) {
        rightStr = `(${rightStr})`;
      }

      return `${leftStr} ${expr.operator} ${rightStr}`;
    }
  }
}
