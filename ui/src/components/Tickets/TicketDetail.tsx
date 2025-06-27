import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useTicketStore } from '../../store/ticketStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Message } from '../../types';

interface TicketDetailProps {
  ticketId: string;
  onClose: () => void;
}

const StyledMessageBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  maxWidth: '80%',
}));

const PlayerMessage = styled(StyledMessageBox)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  alignSelf: 'flex-start',
}));

const StaffMessage = styled(StyledMessageBox)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  alignSelf: 'flex-end',
}));

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), "dd/MM/yy HH:mm", { locale: ptBR });
};

const getStatusChip = (status: string) => {
  switch (status) {
    case 'ABERTO':
      return <Chip label="Aberto" size="small" color="success" variant="outlined" />;
    case 'EM_ATENDIMENTO':
      return <Chip label="Em Atendimento" size="small" color="warning" variant="outlined" />;
    case 'FECHADO':
      return <Chip label="Fechado" size="small" color="error" variant="outlined" />;
    default:
      return null;
  }
};

const getPriorityChip = (priority: string) => {
  switch (priority) {
    case 'BAIXA':
      return <Chip label="Baixa" size="small" color="info" variant="outlined" />;
    case 'MÉDIA':
      return <Chip label="Média" size="small" color="success" variant="outlined" />;
    case 'ALTA':
      return <Chip label="Alta" size="small" color="warning" variant="outlined" />;
    case 'URGENTE':
      return <Chip label="Urgente" size="small" color="error" variant="outlined" />;
    default:
      return null;
  }
};

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onClose }) => {
  const [message, setMessage] = useState('');
  const ticket = useTicketStore((state) => state.getTicketById(ticketId));
  const addMessageToTicket = useTicketStore((state) => state.addMessageToTicket);

  if (!ticket) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Ticket não encontrado</Typography>
      </Box>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 999, // Staff ID
      senderName: 'Staff',
      content: message,
      timestamp: Date.now(),
      isStaff: true,
    };

    addMessageToTicket(ticketId, newMessage);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            {ticket.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            {getStatusChip(ticket.status)}
            {getPriorityChip(ticket.priority)}
          </Box>
        </Box>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Ticket Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Jogador: {ticket.playerName} (ID: {ticket.playerId})
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Criado em: {formatDate(ticket.createdAt)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ticket.assignedTo ? `Atribuído a: ${ticket.assignedTo.name}` : 'Não atribuído'}
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Descrição:
          </Typography>
          <Typography variant="body2">{ticket.description}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {ticket.messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: msg.isStaff ? 'row-reverse' : 'row',
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: msg.isStaff ? 'primary.main' : 'grey.700',
                width: 32,
                height: 32,
                mr: msg.isStaff ? 0 : 1,
                ml: msg.isStaff ? 1 : 0,
              }}
            >
              {msg.senderName.charAt(0)}
            </Avatar>
            <Box>
              {msg.isStaff ? (
                <StaffMessage>
                  <Typography variant="subtitle2">{msg.senderName}</Typography>
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {formatDate(msg.timestamp)}
                  </Typography>
                </StaffMessage>
              ) : (
                <PlayerMessage>
                  <Typography variant="subtitle2">{msg.senderName}</Typography>
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {formatDate(msg.timestamp)}
                  </Typography>
                </PlayerMessage>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          multiline
          maxRows={4}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          Enviar
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketDetail;
