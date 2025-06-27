import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider>
      <CssBaseline />
      <VisibilityProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VisibilityProvider>
    </ThemeProvider>
  </StrictMode>
);
