import React, { createContext, useContext, useState } from "react";
import type { ProgramNode, StatementNode } from "../types/ast.ts";

interface BlockContextType {
  program: ProgramNode;
  addStatement: (parentId: string | null, node: StatementNode) => void;
  updateStatement: (
    id: string,
    updater: (node: StatementNode) => StatementNode,
  ) => void;
  removeStatement: (id: string) => void;
}

const BlockContext = createContext<BlockContextType | null>(null);

export const useBlockContext = () => {
  const context = useContext(BlockContext);
  if (!context) throw new Error("BlockContext not found");
  return context;
};

export const BlockContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [program, setProgram] = useState<ProgramNode>({
    type: "Program",
    body: [],
  });

  const addStatement = (parentId: string | null, node: StatementNode) => {
    setProgram((prev) => {
      if (!parentId) {
        return { ...prev, body: [...prev.body, node] };
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
        ...prev,
        body: addRecursively(prev.body),
      };
    });
  };

  const updateStatement = (
    id: string,
    updater: (node: StatementNode) => StatementNode,
  ) => {
    const updateRecursively = (statements: StatementNode[]): StatementNode[] =>
      statements.map((stmt) => {
        if (stmt.id === id) {
          return updater(stmt);
        }

        if ("body" in stmt) {
          return {
            ...stmt,
            body: updateRecursively(stmt.body),
          };
        }

        return stmt;
      });

    setProgram((prev) => ({
      ...prev,
      body: updateRecursively(prev.body),
    }));
  };

  const removeStatement = (id: string) => {
    const removeRecursively = (statements: StatementNode[]): StatementNode[] =>
      statements
        .filter((stmt) => stmt.id !== id)
        .map((stmt) =>
          "body" in stmt
            ? { ...stmt, body: removeRecursively(stmt.body) }
            : stmt,
        );

    setProgram((prev) => ({
      ...prev,
      body: removeRecursively(prev.body),
    }));
  };

  return (
    <BlockContext.Provider
      value={{ program, addStatement, updateStatement, removeStatement }}
    >
      {children}
    </BlockContext.Provider>
  );
};
