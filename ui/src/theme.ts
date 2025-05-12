import { Typography, createTheme, styled } from "@mui/material";

export const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#40c057",
      light: "#f0c972",
      dark: "#b38d2e",
      contrastText: "#111",
    },
    secondary: {
      main: "#6E88A9",
      light: "#8ea0b9",
      dark: "#546a85",
      contrastText: "#fff",
    },
    background: {
      default: "transparent",
      paper: "#00000098",
    },
    text: {
      primary: "#D9D9D9",
      secondary: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    h1: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 2,
    },
    h2: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 2,
    },
    h3: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 1.5,
    },
    h4: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 1.5,
    },
    h5: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 1,
    },
    h6: {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: 1,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'DumbNerd';
          src: url('/assets/fonts/DumbNerd-Regular.otf');
          font-style: normal;
          font-display: swap;
        }
      `,
    },
  },
});

const theme = createTheme({
  ...baseTheme,
  breakpoints: {
    values: {
      xs: 0,
      sm: 720, // 720p
      md: 1100, // Resolução PVPAS
      lg: 1366, // 768p
      xl: 1920, // 1080p
    },
  },
});

export const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontFamily: "SF Display, sans-serif",
  fontWeight: 700,
  letterSpacing: 1,
}));

export const LabelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "SF Display, sans-serif",
  color: theme.palette.text.primary,
}));

export default theme;
