import type { ProgramNode, StatementNode } from "../src/types/ast";

function removeStatementPure(program: ProgramNode, id: string): ProgramNode {
  const removeRecursively = (statements: StatementNode[]): StatementNode[] =>
    statements
      .filter((stmt) => stmt.id !== id)
      .map((stmt) =>
        "body" in stmt ? { ...stmt, body: removeRecursively(stmt.body) } : stmt,
      );

  return {
    ...program,
    body: removeRecursively(program.body),
  };
}

function addStatementPure(
  program: ProgramNode,
  parentId: string | null,
  node: StatementNode,
): ProgramNode {
  if (!parentId) {
    return {
      ...program,
      body: [...program.body, node],
    };
  }

  const addRecursively = (statements: StatementNode[]): StatementNode[] =>
    statements.map((stmt) => {
      if (stmt.id === parentId && "body" in stmt) {
        return {
          ...stmt,
          body: [...stmt.body, node],
        };
      }

      if ("body" in stmt) {
        return {
          ...stmt,
          body: addRecursively(stmt.body),
        };
      }

      return stmt;
    });

  return {
    ...program,
    body: addRecursively(program.body),
  };
}

let program = {
  type: "Program",
  body: [],
};

const VariableDeclarationNode = {
  id: "1",
  type: "VariableDeclaration",
  name: "abc",
};

const AssignmentNode = {
  id: "2",
  type: "Assignment",
  target: "abc",
  value: 123,
};

const ForNode = {
  id: "3",
  type: "For",
  iterator: "i",
  from: 0,
  to: 5,
  body: [],
};

const print = {
  id: "4",
  type: "Print",
  expression: {
    type: "BinaryExpression",
    operator: "*",
    left: "abc",
    right: "i",
  },
};

console.log(program);

// @ts-ignore
program = addStatementPure(program, null, VariableDeclarationNode);
// @ts-ignore
program = addStatementPure(program, null, AssignmentNode);
// @ts-ignore
program = addStatementPure(program, null, ForNode);
// @ts-ignore
program = addStatementPure(program, "3", print);
// @ts-ignore
program = addStatementPure(program, "3", print); // @ts-ignore
program = addStatementPure(program, "3", print); // @ts-ignore
program = addStatementPure(program, "3", print); // @ts-ignore

program = removeStatementPure(program, "3");

console.log(JSON.stringify(program, null, 2));
