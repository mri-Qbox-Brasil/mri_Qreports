import React from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChatBox from "../components/Chat/ChatBox";
import { useTicketStore } from "../store/ticketStore";
import TicketList from "../components/Tickets/TicketList";
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
      {value === index && <Box sx={{ height: "100%", pt: 2 }}>{children}</Box>}
    </div>
  );
};

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  padding: theme.spacing(1),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const HomePage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const tickets = useTicketStore((state) => state.tickets);

  const openTickets = tickets.filter((t) => t.status === TicketStatus.OPEN);
  const inProgressTickets = tickets.filter(
    (t) => t.status === TicketStatus.IN_PROGRESS
  );
  const closedTickets = tickets.filter((t) => t.status === TicketStatus.CLOSED);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={3}
        sx={{ mb: 3 }}
      >
        <Box gridColumn="span 4">
          <StatCard>
            <CardContent>
              <Typography
                color="success"
                variant="h6"
                align="center"
                gutterBottom
              >
                Tickets Abertos
              </Typography>
              <Typography
                variant="h3"
                align="center"
                color="success.light"
                sx={{ fontWeight: 700 }}
              >
                {openTickets.length}
              </Typography>
            </CardContent>
          </StatCard>
        </Box>

        <Box gridColumn="span 4">
          <StatCard>
            <CardContent>
              <Typography
                color="warning"
                variant="h6"
                align="center"
                gutterBottom
              >
                Em Atendimento
              </Typography>
              <Typography
                variant="h3"
                align="center"
                color="warning.light"
                sx={{ fontWeight: 700 }}
              >
                {inProgressTickets.length}
              </Typography>
            </CardContent>
          </StatCard>
        </Box>

        <Box gridColumn="span 4">
          <StatCard>
            <CardContent>
              <Typography
                color="error"
                variant="h6"
                align="center"
                gutterBottom
              >
                Fechados Hoje
              </Typography>
              <Typography
                variant="h3"
                align="center"
                color="error.light"
                sx={{ fontWeight: 700 }}
              >
                {closedTickets.length}
              </Typography>
            </CardContent>
          </StatCard>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={3}
        sx={{ height: "calc(100% - 130px)" }}
      >
        <Box
          gridColumn={{ xs: "span 12", md: "span 8" }}
          sx={{ height: "100%" }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tickets Recentes
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="ticket tabs"
              >
                <Tab label="Todos" />
                <Tab label="Abertos" />
                <Tab label="Em Atendimento" />
                <Tab label="Fechados" />
              </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <TabPanel value={tabValue} index={0}>
                <TicketList onSelectTicket={() => {}} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TicketList
                  status={TicketStatus.OPEN}
                  onSelectTicket={() => {}}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TicketList
                  status={TicketStatus.IN_PROGRESS}
                  onSelectTicket={() => {}}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <TicketList
                  status={TicketStatus.CLOSED}
                  onSelectTicket={() => {}}
                />
              </TabPanel>
            </Box>
          </Paper>
        </Box>

        <Box
          gridColumn={{ xs: "span 12", md: "span 4" }}
          sx={{ height: "100%" }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Chat da Staff
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <ChatBox isStaffChat={true} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
