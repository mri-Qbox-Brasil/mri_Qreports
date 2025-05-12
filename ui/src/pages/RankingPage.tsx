import React from "react";
import { Box, Typography } from "@mui/material";
import StaffRanking from "../components/Staff/StaffRanking";

const RankingPage: React.FC = () => {
  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Ranking da Staff
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Este ranking exibe os membros da staff com base no número de tickets
        fechados e avaliações recebidas.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <StaffRanking />
      </Box>
    </Box>
  );
};

export default RankingPage;
