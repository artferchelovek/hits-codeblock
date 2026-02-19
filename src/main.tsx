import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App/App.tsx";
import { DndContext } from "@dnd-kit/core";
import { BlockContextProvider } from "./context/BlockContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DndContext>
      <BlockContextProvider>
        <App />
      </BlockContextProvider>
    </DndContext>
  </StrictMode>,
);
