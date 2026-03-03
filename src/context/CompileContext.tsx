import { createContext, useContext, useState } from "react";
import type { ExpressionNode } from "../types/ast.ts";

export interface Compilator {
  isRunning: boolean;
  printable: ExpressionNode[];
}

interface CompileContextType {
  compilator: Compilator;
  updateStatus: () => void;
  addPrintable: (node: ExpressionNode) => void;
  clearPrintable: () => void;
}

const CompileContext = createContext<CompileContextType | null>(null);

export const useCompileContext = () => {
  const context = useContext(CompileContext);
  if (!context) {
    throw new Error("useCompileContext not found");
  }
  return context;
};

export const CompileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [compilator, setCompilator] = useState<Compilator>({
    isRunning: false,
    printable: [],
  });

  const clearPrintable = () =>
    setCompilator((prev) => ({ ...prev, printable: [] }));

  const updateStatus = () => {
    setCompilator((prev) => ({
      ...prev,
      isRunning: !compilator.isRunning,
    }));
  };

  const addPrintable = (nodes: ExpressionNode) => {
    setCompilator((prev) => ({
      ...prev,
      printable: [...prev.printable, nodes],
    }));
  };

  return (
    <CompileContext.Provider
      value={{
        compilator,
        updateStatus,
        addPrintable,
        clearPrintable,
      }}
    >
      {children}
    </CompileContext.Provider>
  );
};
