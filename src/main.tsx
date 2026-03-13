import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App/App.tsx";
import { ProgramContextProvider } from "./context/ProgramContext.tsx";
import { InteractionContextProvider } from "./context/InteractionContext.tsx";
import { CompileContextProvider } from "./context/CompileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CompileContextProvider>
      <ProgramContextProvider>
        <InteractionContextProvider>
          <App />
        </InteractionContextProvider>
      </ProgramContextProvider>
    </CompileContextProvider>
  </StrictMode>,
);
