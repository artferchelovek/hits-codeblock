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
  removeProgram: () => void;
  getProgram: () => ProgramNode;
  refreshProgram: (newProgram: ProgramNode) => void;
  updateProgramName: (programName: string) => ProgramNode;
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
    name: "NewProgram",
    body: [],
  });

  const addStatement = (parentId: string | null, node: StatementNode) => {
    console.log("addStatement", parentId, node);
    setProgram((prev) => {
      if (!parentId) {
        return { ...prev, body: [...prev.body, node] };
      }

      return {
        ...prev,
        body: prev.body,
      };
    });
  };

  const updateStatement = (
    id: string,
    updater: (node: StatementNode) => StatementNode,
  ) => {
    const update = (statements: StatementNode[]): StatementNode[] =>
      statements.map((stmt) => {
        if (stmt.id === id) {
          return updater(stmt);
        }

        return stmt;
      });

    setProgram((prev) => ({
      ...prev,
      body: update(prev.body),
    }));
  };

  const removeStatement = (id: string) => {
    const remove = (statements: StatementNode[]): StatementNode[] =>
      statements.filter((stmt) => stmt.id !== id);

    setProgram((prev) => ({
      ...prev,
      body: remove(prev.body),
    }));
  };

  const removeProgram = () => {
    setProgram((prev) => ({ ...prev, body: [] }));
  };

  const getProgram = (): ProgramNode => {
    return program;
  };

  const refreshProgram = (newProgram: ProgramNode) => {
    setProgram(newProgram);
  };

  const updateProgramName = (programName: string) => {
    return {
      ...program,
      name: programNam,
    };
  };

  return (
    <BlockContext.Provider
      value={{
        program,
        addStatement,
        updateStatement,
        removeStatement,
        removeProgram,
        getProgram,
        refreshProgram,
        updateProgramName,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};
