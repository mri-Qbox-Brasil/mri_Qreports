import React, { useState } from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import TicketList from "../components/Tickets/TicketList";
import TicketDetails from "../components/Tickets/TicketDetails";
import { TicketStatus } from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tickets-tabpanel-${index}`}
      aria-labelledby={`tickets-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </div>
  );
};

const TicketsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedTicketId(null); // Reset ticket selection when changing tabs
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleCloseDetails = () => {
    setSelectedTicketId(null);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Gerenciamento de Tickets
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="ticket status tabs"
        >
          <Tab label="Todos" />
          <Tab label="Abertos" />
          <Tab label="Em Atendimento" />
          <Tab label="Fechados" />
        </Tabs>
      </Box>

      <Box sx={{ height: "calc(100% - 80px)" }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gap={2}
          sx={{ height: "100%" }}
        >
          <Box
            gridColumn={{
              xs: "span 12",
              md: selectedTicketId ? "span 5" : "span 12",
            }}
            sx={{ height: "100%" }}
          >
            <Paper
              elevation={2}
              sx={{
                height: "100%",
                overflow: "auto",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <TicketList
                  onSelectTicket={handleSelectTicket}
                  selectedTicketId={selectedTicketId || undefined}
                  maxHeight="auto"
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TicketList
                  status={TicketStatus.OPEN}
                  onSelectTicket={handleSelectTicket}
                  selectedTicketId={selectedTicketId || undefined}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TicketList
                  status={TicketStatus.IN_PROGRESS}
                  onSelectTicket={handleSelectTicket}
                  selectedTicketId={selectedTicketId || undefined}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <TicketList
                  status={TicketStatus.CLOSED}
                  onSelectTicket={handleSelectTicket}
                  selectedTicketId={selectedTicketId || undefined}
                />
              </TabPanel>
            </Paper>
          </Box>

          {selectedTicketId && (
            <Box
              gridColumn={{ xs: "span 12", md: "span 7" }}
              sx={{ height: "100%" }}
            >
              <Paper
                elevation={2}
                sx={{
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <TicketDetails
                  ticketId={selectedTicketId}
                  onClose={handleCloseDetails}
                />
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TicketsPage;
