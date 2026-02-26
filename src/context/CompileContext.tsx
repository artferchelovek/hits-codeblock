import { createContext, useContext } from "react";

interface CompileContextType {
  updateStatus: (status: boolean) => void;
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
  const updateStatus = (status: boolean) => {
    return status;
  };

  return (
    <CompileContext.Provider
      value={{
        updateStatus,
      }}
    >
      {children}
    </CompileContext.Provider>
  );
};
