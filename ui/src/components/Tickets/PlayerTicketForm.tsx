import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useTicketStore } from "../../store/ticketStore";
import { TicketPriority } from "../../types";
import { fetchNui } from "../../utils/fetchNui";

interface PlayerTicketFormProps {
  visible: boolean;
  onClose: () => void;
}

const PlayerTicketForm: React.FC<PlayerTicketFormProps> = ({
  visible,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.MEDIUM
  );
  const [submitting, setSubmitting] = useState(false);
  const { addTicket } = useTicketStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);

    try {
      const ticketData = {
        title,
        description,
        priority,
      };

      const response = await fetchNui("createTicket", ticketData);

      if (response) {
        addTicket(response);
        setTitle("");
        setDescription("");
        setPriority(TicketPriority.MEDIUM);
        onClose();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={visible}
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
      <DialogTitle
        sx={{
          color: "primary.main",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Criar Novo Ticket
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

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
            placeholder="Descreva em detalhes o seu problema ou solicitação..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!title.trim() || !description.trim() || submitting}
          endIcon={<SendIcon />}
        >
          Enviar Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerTicketForm;
