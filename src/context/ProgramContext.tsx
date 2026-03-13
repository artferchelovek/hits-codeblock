import React, { createContext, useContext, useState } from "react";
import type { ProgramNode, StatementNode } from "../types/ast.ts";

interface ProgramContextType {
  program: ProgramNode;
  addStatement: (node: StatementNode) => void;
  updateStatement: (
    id: string,
    updater: (n: StatementNode) => StatementNode,
  ) => void;
  removeStatement: (id: string) => void;
  removeProgram: () => void;
  getProgram: () => ProgramNode;
  refreshProgram: (newProgram: ProgramNode) => void;
  updateProgramName: (programName: string) => void;
}

const ProgramContext = createContext<ProgramContextType | null>(null);

export const useProgramContext = () => {
  const context = useContext(ProgramContext);
  if (!context) throw new Error("ProgramContext not found");
  return context;
};

export const ProgramContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [program, setProgram] = useState<ProgramNode>({
    type: "Program",
    name: "NewProgram",
    body: [],
  });

  const addStatement = (node: StatementNode) => {
    setProgram((prev) => ({ ...prev, body: [...prev.body, node] }));
  };

  const updateStatement = (
    id: string,
    updater: (node: StatementNode) => StatementNode,
  ) => {
    setProgram((prev) => ({
      ...prev,
      body: prev.body.map((stmt) => (stmt.id === id ? updater(stmt) : stmt)),
    }));
  };

  const removeStatement = (id: string) => {
    setProgram((prev) => ({
      ...prev,
      body: prev.body.filter((stmt) => stmt.id !== id),
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
    setProgram((prev) => ({ ...prev, name: programName }));
  };

  return (
    <ProgramContext.Provider
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
    </ProgramContext.Provider>
  );
};
