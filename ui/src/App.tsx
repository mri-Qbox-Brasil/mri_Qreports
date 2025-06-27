import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import { Box, CircularProgress } from "@mui/material";
import { isEnvBrowser } from "./utils/misc";
import HexColorPicker from "./components/ColorPicker/HexColorPicker";
import PlayerTicketForm from "./components/Tickets/PlayerTicketForm";
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
  const [playerTicketVisible, setPlayerTicketVisible] = useState(false);
  const isBrowser = isEnvBrowser();

  useEffect(() => {
    setMounted(true);
        const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'showPlayerTicketForm') {
        setPlayerTicketVisible(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundImage: isBrowser ? "url(/assets/img/debug-bg.jpg)" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowY: "hidden",

      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: {
              xs: "100%",
              sm: "95%",
              md: "90%",
              lg: "80%",
              xl: "70%"
            },
            maxWidth: "1920px",
            height: {
              xs: "100%",
              sm: "95%",
              md: "90%",
            },
            maxHeight: "1080px",
            gap: 2,
          }}
        >
          {/* Sidebar navigation - outside the main panel */}
          <Box
            sx={{
              width: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              
              py: 2,
            }}
          >
            <Sidebar />
          </Box>
          
          {/* Main content panel */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              overflow: "auto",
              display: "flex",
              overflowY: "hidden",
              flexDirection: "column",
              padding: 3,
              maxHeight: {
                xs: "100%",
                sm: "95%",
                md: "100%",
              },
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Box>
      {/* Color Picker - Only visible in browser mode */}
      <HexColorPicker />
      
      <PlayerTicketForm 
        visible={playerTicketVisible} 
        onClose={() => setPlayerTicketVisible(false)} 
      />
    </Box>
  );
};

export default App;
