import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { baseTheme, TitleTypography, LabelTypography } from "../theme";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { isEnvBrowser } from "../utils/misc";
import { fetchNui } from "../utils/fetchNui";

interface ThemeConfig {
  primary: string;
  secondary: string;
}

interface ThemeContextProps {
  themeConfig: ThemeConfig;
  theme: ReturnType<typeof createTheme>;
  setThemeConfig: (config: ThemeConfig) => void;
  updatePrimaryColor: (color: string) => void;
}

const defaultThemeConfig: ThemeConfig = {
  primary: baseTheme.palette.primary.main,
  secondary: baseTheme.palette.secondary.main,
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultThemeConfig);

  
  useNuiEvent<ThemeConfig>("setThemeConfig", (data) => {
    setThemeConfig(data);
  });

  
  useEffect(() => {
    const handleThemeColorUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.primaryColor) {
        setThemeConfig(prev => ({
          ...prev,
          primary: event.detail.primaryColor
        }));
      }
    };

    window.addEventListener('updateThemeColor', handleThemeColorUpdate as EventListener);
    
    return () => {
      window.removeEventListener('updateThemeColor', handleThemeColorUpdate as EventListener);
    };
  }, []);

  
  useEffect(() => {
    if (isEnvBrowser()) {
      debugData([
        {
          action: "setThemeConfig",
          data: {
            primary: "#40c057",
            secondary: "#6E88A9",
          },
        },
      ]);
    } else {
      
      fetchNui<ThemeConfig>('getConfig')
        .then((config) => {
          if (config) {
            setThemeConfig(config);
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar configuração do tema:', error);
        });
    }
  }, []);

  
  const updatePrimaryColor = (color: string) => {
    setThemeConfig(prev => ({
      ...prev,
      primary: color
    }));
    
    
    if (!isEnvBrowser()) {
      fetchNui('updatePrimaryColor', { color })
        .catch(error => {
          console.error('Erro ao atualizar cor primária no servidor:', error);
        });
    }
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          mode: "light", // Sempre usar modo claro para evitar o fundo preto
          primary: {
            main: themeConfig.primary || baseTheme.palette.primary.main,
            light: themeConfig.primary ? `${themeConfig.primary}99` : baseTheme.palette.primary.light,
            dark: themeConfig.primary ? `${themeConfig.primary}dd` : baseTheme.palette.primary.dark,
            contrastText: "#111",
          },
          secondary: {
            main: themeConfig.secondary || baseTheme.palette.secondary.main,
            light: themeConfig.secondary ? `${themeConfig.secondary}99` : baseTheme.palette.secondary.light,
            dark: themeConfig.secondary ? `${themeConfig.secondary}dd` : baseTheme.palette.secondary.dark,
            contrastText: "#fff",
          },
          background: {
            default: "transparent",
            paper: "rgba(255, 255, 255, 0.8)",
          },
          text: {
            primary: "#f3eeee",
            secondary: "#d9d9d9",
          },
        },
      }),
    [themeConfig]
  );

  return (
    <ThemeContext.Provider
      value={{ themeConfig, theme, setThemeConfig, updatePrimaryColor }}
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
