import type { ExpressionNode } from "../types/ast.ts";

export function parseNameAndSize(input: string): {
  name: string;
  size?: ExpressionNode;
} {
  const trimmed = input.trim();

  const match = trimmed.match(
    /^([a-zA-Zа-яА-Я_][a-zA-Zа-яА-Я0-9_]*)\s*\((.*)\)$/,
  );

  if (match) {
    const name = match[1];
    const sizeContent = match[2].trim();

    try {
      return {
        name: name,
        size: sizeContent ? stringToExpression(sizeContent) : undefined,
      };
    } catch (e) {
      return { name: trimmed };
    }
  }

  return { name: trimmed };
}

function countSymbol(str: string, sym: string): number {
  let count = 0;
  for (const i of str) {
    if (i === sym) {
      count++;
    }
  }
  return count;
}

export function stringToExpression(expression: string): ExpressionNode {
  let current = expression.trim();

  if (
    (current.startsWith('"') &&
      current.endsWith('"') &&
      countSymbol(current, '"') === 2) ||
    (current.startsWith("'") &&
      current.endsWith("'") &&
      countSymbol(current, "'") === 2)
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
  let bracketStack = 0;

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
    if (char === "]") {
      bracketStack--;
      continue;
    }
    if (char === "[") {
      bracketStack++;
      continue;
    }

    if (stack === 0 && bracketStack === 0) {
      const twoCharOp = current.substring(i, i + 2);
      const ops2 = [">=", "<=", "==", "!=", "&&", "||"];
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

      if ("+-*/><%=".includes(char)) {
        const priority = getPriority(char);
        if (priority <= minPriority) {
          minPriority = priority;
          operatorIndex = i;
          foundOperator = char;
        }
      }
    }
  }

  if (operatorIndex !== -1 && !/^-?\d+(\.\d+)?$/.test(current.trim())) {
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
    if (current.startsWith("[")) {
      const elements: ExpressionNode[] = [];
      current
        .slice(1, -1)
        .split(",")
        .forEach((elem) => {
          if (elem.trim()) elements.push(stringToExpression(elem));
        });

      return { type: "Array", value: elements };
    }

    let depth = 0;
    let openbracketIndex = -1;

    for (let i = current.length - 1; i >= 0; i--) {
      if (current[i] === "]") depth++;
      if (current[i] === "[") depth--;
      if (depth === 0) {
        openbracketIndex = i;
        break;
      }
    }

    if (openbracketIndex > 0) {
      return {
        type: "MemberExpression",
        object: stringToExpression(current.slice(0, openbracketIndex).trim()),
        index: stringToExpression(
          current.slice(openbracketIndex + 1, -1).trim(),
        ),
      };
    }
  }

  const trimmedCurrent = current.trim();
  if (/^(?:true|false)$/.test(trimmedCurrent)) {
    return { type: "Boolean", value: trimmedCurrent === "true" };
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmedCurrent)) {
    return { type: "Literal", value: Number(trimmedCurrent) };
  }
  if (/^[a-zA-Zа-яА-Я_][a-zA-Zа-яА-Я0-9_]*$/.test(trimmedCurrent)) {
    return { type: "Identifier", name: trimmedCurrent };
  }

  throw new Error("Invalid expression: " + expression);
}

function getPriority(operator: string): number {
  switch (operator) {
    case "=":
      return -3;
    case "||":
      return -2;
    case "&&":
      return -1;
    case "==":
    case ">":
    case "<":
    case ">=":
    case "<=":
    case "!=":
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
      return `${expr.value}`;
    case "String":
      return `"${expr.value}"`;
    case "Identifier":
      return expr.name;
    case "Boolean":
      return String(expr.value);
    case "BinaryExpression":
      return `${renderExpression(expr.left)} ${expr.operator} ${renderExpression(expr.right)}`;
    case "Array":
      return `[${expr.value.map((i) => renderExpression(i)).join(", ")}]`;
    case "MemberExpression":
      return `${renderExpression(expr.object)}[${renderExpression(expr.index)}]`;
    default:
      return "";
  }
}
