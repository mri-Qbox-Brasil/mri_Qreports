import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { baseTheme, TitleTypography, LabelTypography } from "../theme";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";

interface ThemeConfig {
  primary: string;
  secondary: string;
}

interface ThemeContextProps {
  themeConfig: ThemeConfig;
  theme: ReturnType<typeof createTheme>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultThemeConfig: ThemeConfig = {
  primary: "#de8004",
  secondary: "#6E88A9",
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeConfig, setThemeConfig] =
    useState<ThemeConfig>(defaultThemeConfig);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useNuiEvent<ThemeConfig>("setThemeConfig", (data) => {
    setThemeConfig(data);
  });

  // Para testes em ambiente de desenvolvimento
  useEffect(() => {
    debugData([
      {
        action: "setThemeConfig",
        data: {
          primary: "#04de12",
          secondary: "#6E88A9",
        },
      },
    ]);
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: themeConfig.primary,
            light: `${themeConfig.primary}99`,
            dark: `${themeConfig.primary}dd`,
            contrastText: isDarkMode ? "#111" : "#fff",
          },
          secondary: {
            main: themeConfig.secondary,
            light: `${themeConfig.secondary}99`,
            dark: `${themeConfig.secondary}dd`,
            contrastText: "#fff",
          },
          background: {
            default: isDarkMode ? "#00000098" : "#f5f5f5",
            paper: isDarkMode ? "#00000098" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#D9D9D9" : "#333333",
            secondary: isDarkMode ? "#aaaaaa" : "#555555",
          },
        },
      }),
    [themeConfig, isDarkMode]
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider
      value={{ themeConfig, theme, isDarkMode, toggleDarkMode }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { TitleTypography, LabelTypography };
