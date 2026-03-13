import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface InteractionContextType {
  activeNode: string | null;
  errorNode: {
    node: string | null;
    message: string | undefined;
  };
  setActiveNode: (node: string | null) => void;
  setErrorNode: (node: string | null, message: string | undefined) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  theme: Theme;
  toggleTheme: () => void;
}

const InteractionContext = createContext<InteractionContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useInteractionContext = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error("InteractionContext not found");
  return context;
};

export const InteractionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [errorNode, setErrorNodeState] = useState<{
    node: string | null;
    message: string | undefined;
  }>({
    node: null,
    message: undefined,
  });
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );

  const setErrorNode = (node: string | null, message: string | undefined) => {
    setErrorNodeState({ node, message });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <InteractionContext.Provider
      value={{
        activeNode,
        setActiveNode,
        errorNode,
        setErrorNode,
        zoom,
        setZoom,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
};
