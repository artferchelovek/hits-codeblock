import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App/App.tsx";
import { BlockContextProvider } from "./context/BlockContext.tsx";
import { CompileContextProvider } from "./context/CompileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CompileContextProvider>
      <BlockContextProvider>
        <App />
      </BlockContextProvider>
    </CompileContextProvider>
  </StrictMode>,
);
