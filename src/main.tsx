import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App/App.tsx";
import { BlockContextProvider } from "./context/BlockContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlockContextProvider>
      <App />
    </BlockContextProvider>
  </StrictMode>,
);
