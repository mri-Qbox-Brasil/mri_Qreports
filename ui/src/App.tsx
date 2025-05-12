import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import { Box, CircularProgress } from "@mui/material";
// Importação lazy dos componentes
const HomePage = lazy(() => import("./pages/HomePage"));
const TicketsPage = lazy(() => import("./pages/TicketsPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: 9999,
    }}
  >
    <CircularProgress color="primary" size={120} thickness={4} />
  </Box>
);

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </Box>
  );
};

export default App;
