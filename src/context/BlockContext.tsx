import React, { createContext, useContext, useState } from "react";
import type {
  AssignmentNode,
  BreakNode,
  ForNode,
  GetSizeNode,
  IfNode,
  PrintNode,
  ProgramNode,
  StartNode,
  StatementNode,
  VariableDeclarationNode,
  WhileNode,
} from "../types/ast.ts";

interface BlockContextType {
  program: ProgramNode;
  addStatement: (node: StatementNode) => void;
  updateStatement: (
    id: string,
    updater: (
      n: StatementNode,
    ) =>
      | VariableDeclarationNode
      | AssignmentNode
      | ForNode
      | WhileNode
      | IfNode
      | PrintNode
      | StartNode
      | GetSizeNode
      | BreakNode,
  ) => void;
  removeStatement: (id: string) => void;
  removeProgram: () => void;
  getProgram: () => ProgramNode;
  refreshProgram: (newProgram: ProgramNode) => void;
  updateProgramName: (programName: string) => void;
  activeNode: string | null;
  setActiveNode: (node: string | null) => void;
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
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const addStatement = (node: StatementNode) => {
    console.log("addStatement", node);
    setProgram((prev) => {
      return { ...prev, body: [...prev.body, node] };
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
    setProgram((prev) => ({
      ...prev,
      name: programName,
    }));
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
        activeNode,
        setActiveNode,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};
