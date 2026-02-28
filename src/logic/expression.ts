import type { ExpressionNode } from "../types/ast.ts";

export function stringToExpression(expression: string): ExpressionNode {
  let current = expression.trim();

  if (
    (current.startsWith('"') && current.endsWith('"')) ||
    (current.startsWith("'") && current.endsWith("'"))
  ) {
    return {
      type: "String",
      value: current.slice(1, -1),
    };
  }

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
    if (isWrapped) return stringToExpression(current.slice(1, -1));
  }

  let stack = 0;
  let inString = false;
  let quoteChar = "";
  let minPriority = Infinity;
  let operatorIndex = -1;
  let foundOperator = "";

  for (let i = 0; i < current.length; i++) {
    const char = current[i];

    if (
      (char === '"' || char === "'") &&
      (i === 0 || current[i - 1] !== "\\")
    ) {
      if (!inString) {
        inString = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inString = false;
      }
      continue;
    }

    if (inString) continue;

    if (char === "(") {
      stack++;
      continue;
    }
    if (char === ")") {
      stack--;
      continue;
    }

    if (stack === 0) {
      const twoCharOp = current.substring(i, i + 2);
      const ops2 = [">=", "<=", "=="];
      if (ops2.includes(twoCharOp)) {
        const priority = getPriority(twoCharOp);
        if (priority <= minPriority) {
          minPriority = priority;
          operatorIndex = i;
          foundOperator = twoCharOp;
        }
        i++;
        continue;
      }

      if ("+-*/><%".includes(char)) {
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
    return {
      type: "BinaryExpression",
      operator: foundOperator as any,
      left: stringToExpression(current.slice(0, operatorIndex)),
      right: stringToExpression(
        current.slice(operatorIndex + foundOperator.length),
      ),
    };
  }
  if (current.endsWith("]")) {
    let depth = 0;
    let bracketIndex = -1;

    for (let i = current.length - 1; i >= 0; i--) {
      if (current[i] === "]") depth++;
      if (current[i] === "[") depth--;
      if (depth === 0) {
        bracketIndex = i;
        break;
      }
    }
    if (current.startsWith("[") && current.endsWith("]")) {
      const elements: ExpressionNode[] = [];

      current

        .slice(1, -1)

        .split(",")

        .forEach((elem) => {
          elements.push(stringToExpression(elem));
        });

      return {
        type: "Array",

        value: elements,
      };
    }

    if (bracketIndex > 0) {
      const objectPart = current.slice(0, bracketIndex).trim();
      const propertyPart = current.slice(bracketIndex + 1, -1).trim();

      return {
        type: "MemberExpression",
        object: stringToExpression(objectPart),
        index: stringToExpression(propertyPart),
      };
    }
  }
  const regNumber = /^-?\d+(\.\d+)?$/;
  const regVariable = /^[a-zA-Zа-яА-Я_][a-zA-Zа-яА-Я0-0_]*$/;

  const trimmedCurrent = current.trim();
  if (regNumber.test(trimmedCurrent)) {
    return { type: "Literal", value: Number(trimmedCurrent) };
  }
  if (regVariable.test(trimmedCurrent)) {
    return { type: "Identifier", name: trimmedCurrent };
  }

  throw new Error("Invalid expression: " + expression);
}

function getPriority(operator: string): number {
  switch (operator) {
    case "==":
    case ">":
    case "<":
    case ">=":
    case "<=":
      return 1;
    case "+":
    case "-":
      return 2;
    case "*":
    case "/":
    case "%":
      return 3;
    default:
      return 0;
  }
}

export function renderExpression(expr: ExpressionNode): string {
  switch (expr.type) {
    case "Literal":
      return String(expr.value);

    case "String":
      return `"${expr.value}"`;

    case "Identifier":
      return expr.name;

    case "BinaryExpression":
      const leftStr = renderExpression(expr.left);
      const rightStr = renderExpression(expr.right);
      return `${leftStr} ${expr.operator} ${rightStr}`;
    case "Array":
      return `[${expr.value.map((i) => renderExpression(i)).join(", ")}]`;
    case "MemberExpression":
      return `${renderExpression(expr.object)}[${renderExpression(expr.index)}]`;

    default:
      return "";
  }
}
