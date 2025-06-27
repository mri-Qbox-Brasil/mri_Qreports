import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Typography,
  Box,
  Paper,
  Divider,
  ListItemButton,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewTicketForm from "./NewTicketForm";
import { isEnvBrowser } from "../../utils/misc";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { Ticket, TicketStatus } from "../../types";
import { useTicketStore } from "../../store/ticketStore";

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: "all 0.2s ease",
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.5, 2),
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

interface TicketListProps {
  status?: TicketStatus;
  onSelectTicket: (ticketId: string) => void;
  selectedTicketId?: string;
  maxHeight?: string;
}

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case "ABERTO":
      return <ErrorOutlineIcon color="primary" />;
    case "EM_ATENDIMENTO":
      return <BuildIcon color="primary" />;
    case "FECHADO":
      return <CheckCircleOutlineIcon color="primary" />;
    default:
      return <ErrorOutlineIcon color="primary" />;
  }
};

const getStatusChip = (status: TicketStatus) => {
  switch (status) {
    case "ABERTO":
      return (
        <Chip label="Aberto" size="small" color="success" variant="outlined" />
      );
    case "EM_ATENDIMENTO":
      return (
        <Chip
          label="Em Atendimento"
          size="small"
          color="warning"
          variant="outlined"
        />
      );
    case "FECHADO":
      return (
        <Chip label="Fechado" size="small" color="error" variant="outlined" />
      );
    default:
      return null;
  }
};

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), "dd/MM/yy HH:mm", { locale: ptBR });
};

const TicketList: React.FC<TicketListProps> = ({
  status,
  onSelectTicket,
  selectedTicketId,
  maxHeight,
}) => {
  const [openNewTicketForm, setOpenNewTicketForm] = useState(false);
  const isBrowser = isEnvBrowser();
  
  const tickets = useTicketStore((state) => {
    if (status) {
      return state.getTicketsByStatus(status);
    }
    return state.tickets;
  });
  
  const handleOpenNewTicketForm = () => {
    setOpenNewTicketForm(true);
  };
  
  const handleCloseNewTicketForm = () => {
    setOpenNewTicketForm(false);
  };

  if (tickets.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nenhum ticket{" "}
          {status === "ABERTO"
            ? "aberto"
            : status === "EM_ATENDIMENTO"
            ? "em atendimento"
            : "fechado"}{" "}
          no momento.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', maxHeight: maxHeight, display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 2,
          overflow: "hidden",
          flex: 1,
          maxHeight: '100%',
          position: 'relative',
        }}
      >
        <List sx={{ width: "100%", p: 0 }}>
          {tickets.map((ticket: Ticket, index: number) => (
          <React.Fragment key={ticket.id}>
            <ListItem
              disablePadding
              alignItems="flex-start"
              sx={{
                backgroundColor:
                  selectedTicketId === ticket.id
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
              }}
            >
              <StyledListItem
                onClick={() => onSelectTicket(ticket.id)}
                selected={selectedTicketId === ticket.id}
                sx={{
                  bgcolor:
                    selectedTicketId === ticket.id
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary" }}>
                    {getStatusIcon(ticket.status)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: {
                            xs: '0.875rem',
                            sm: '1rem',
                            md: '1.1rem',
                          },
                          lineHeight: 1.2,
                        }}
                      >
                        {ticket.title}
                      </Typography>
                      <Box>{getStatusChip(ticket.status)}</Box>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ 
                          display: "block", 
                          mb: 0.5,
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.8rem',
                            md: '0.875rem',
                          },
                        }}
                      >
                        {ticket.playerName} - ID: {ticket.playerId}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          mb: 0.5,
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.75rem',
                            md: '0.8rem',
                          },
                          display: '-webkit-box',
                          WebkitLineClamp: {
                            xs: 2,
                            sm: 2,
                            md: 3,
                          },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ticket.description}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ 
                            fontSize: {
                              xs: '0.65rem',
                              sm: '0.7rem',
                              md: '0.75rem',
                            },
                          }}
                        >
                          Criado: {formatDate(ticket.createdAt)}
                        </Typography>
                        {ticket.assignedTo && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ 
                              fontSize: {
                                xs: '0.65rem',
                                sm: '0.7rem',
                                md: '0.75rem',
                              },
                            }}
                          >
                            Atribuído a: {ticket.assignedTo.name}
                          </Typography>
                        )}
                      </Box>
                    </React.Fragment>
                  }
                />
              </StyledListItem>
            </ListItem>
            {index < tickets.length - 1 && (
              <Divider
                variant="inset"
                component="li"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
      </Paper>
      
      {/* SOMENTE BROWSER PRA TESTE NOVO TICKET */}
      {isBrowser && (
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={handleOpenNewTicketForm}
          sx={{ 
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}
      
      <NewTicketForm 
        open={openNewTicketForm} 
        onClose={handleCloseNewTicketForm} 
      />
    </Box>
  );
};

export default TicketList;
