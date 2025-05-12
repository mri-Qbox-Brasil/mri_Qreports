import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import "./index.css";
import { VisibilityProvider } from "./providers/VisibilityProvider";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VisibilityProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VisibilityProvider>
    </ThemeProvider>
  </StrictMode>
);
