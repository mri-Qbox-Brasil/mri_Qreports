import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTicketStore } from "../../store/ticketStore";
import { TicketStatus, TicketPriority } from "../../types";

interface NewTicketFormProps {
  open: boolean;
  onClose: () => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.MEDIUM
  );
  const { addTicket } = useTicketStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const newTicket = {
      id: Date.now().toString(),
      playerId: 1, // Mock player ID
      playerName: "Jogador", // Mock player name
      title,
      description,
      status: TicketStatus.OPEN,
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      assignedTo: undefined,
      messages: [
        {
          id: Date.now().toString(),
          senderId: 1,
          senderName: "Jogador",
          content: description,
          timestamp: Date.now(),
          isStaff: false,
        },
      ],
    };

    addTicket(newTicket);

    setTitle("");
    setDescription("");
    setPriority(TicketPriority.MEDIUM);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: "primary.main" }}>Novo Ticket</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Prioridade</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              label="Prioridade"
            >
              <MenuItem value={TicketPriority.LOW}>Baixa</MenuItem>
              <MenuItem value={TicketPriority.MEDIUM}>Média</MenuItem>
              <MenuItem value={TicketPriority.HIGH}>Alta</MenuItem>
              <MenuItem value={TicketPriority.URGENT}>Urgente</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!title.trim() || !description.trim()}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTicketForm;
