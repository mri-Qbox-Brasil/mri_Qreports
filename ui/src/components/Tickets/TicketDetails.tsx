import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  Avatar,
  styled,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TeleportIcon from "@mui/icons-material/MyLocation";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { TicketStatus } from "../../types";
import { useTicketStore } from "../../store/ticketStore";
import { useStaffChatStore } from "../../store/staffChatStore";
import ChatBox from "../Chat/ChatBox";

const StatusChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 600,
}));

const PlayerInfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  marginBottom: theme.spacing(2),
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

interface TicketDetailsProps {
  ticketId: string;
  onClose: () => void;
}

const getStatusChip = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:
      return (
        <StatusChip
          icon={<ErrorOutlineIcon />}
          label="Aberto"
          color="success"
        />
      );
    case TicketStatus.IN_PROGRESS:
      return (
        <StatusChip
          icon={<BuildIcon />}
          label="Em Atendimento"
          color="warning"
        />
      );
    case TicketStatus.CLOSED:
      return (
        <StatusChip
          icon={<CheckCircleOutlineIcon />}
          label="Fechado"
          color="error"
        />
      );
    default:
      return null;
  }
};

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticketId, onClose }) => {
  const { getTicketById, updateTicketStatus, teleportToPlayer, assignTicket } =
    useTicketStore();
  const { currentUserId, currentUserName, isStaff } = useStaffChatStore();

  const ticket = getTicketById(ticketId);

  if (!ticket) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Ticket não encontrado</Typography>
        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Paper>
    );
  }

  const handleTeleport = () => {
    teleportToPlayer(ticket.playerId);
  };

  const handleAssign = () => {
    if (isStaff) {
      assignTicket(ticketId, currentUserId, currentUserName);
    }
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
  };

  const canChangeStatus =
    isStaff &&
    (ticket.status === TicketStatus.OPEN ||
      (ticket.status === TicketStatus.IN_PROGRESS &&
        ticket.assignedTo?.id === currentUserId));

  const isAssignedToCurrentUser = ticket.assignedTo?.id === currentUserId;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="h2">
              {ticket.title}
            </Typography>
            {getStatusChip(ticket.status)}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          sx={{ mt: 2, mb: 2, fontStyle: "italic", color: "text.secondary" }}
        >
          "{ticket.description}"
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn={{ xs: "span 12", sm: "span 6" }}>
            <PlayerInfoCard>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Informações do Jogador
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    {ticket.playerName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" fontWeight={500}>
                    {ticket.playerName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ID: {ticket.playerId}
                </Typography>

                <Box mt={2} display="flex" gap={1}>
                  <Tooltip title="Teleportar até o jogador">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<TeleportIcon />}
                      onClick={handleTeleport}
                      disabled={!isStaff}
                    >
                      Teleportar
                    </Button>
                  </Tooltip>
                </Box>
              </CardContent>
            </PlayerInfoCard>
          </Box>

          <Box gridColumn={{ xs: "span 12", sm: "span 6" }}>
            <PlayerInfoCard>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Status do Ticket
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Criado em: {formatDate(ticket.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Última atualização: {formatDate(ticket.updatedAt)}
                  </Typography>

                  {ticket.assignedTo ? (
                    <Typography variant="body2" color="text.secondary">
                      Atribuído a: <strong>{ticket.assignedTo.name}</strong>
                    </Typography>
                  ) : (
                    <Box mt={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<GroupAddIcon />}
                        onClick={handleAssign}
                        disabled={
                          !isStaff || ticket.status === TicketStatus.CLOSED
                        }
                      >
                        Atribuir para mim
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </PlayerInfoCard>
          </Box>
        </Box>

        {canChangeStatus && (
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            {ticket.status === TicketStatus.OPEN && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleStatusChange(TicketStatus.IN_PROGRESS)}
              >
                Iniciar Atendimento
              </Button>
            )}

            {ticket.status === TicketStatus.IN_PROGRESS &&
              isAssignedToCurrentUser && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange(TicketStatus.CLOSED)}
                >
                  Fechar Ticket
                </Button>
              )}
          </Box>
        )}
      </Paper>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Chat
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChatBox ticketId={ticketId} height="100%" />
      </Box>
    </Box>
  );
};

export default TicketDetails;
