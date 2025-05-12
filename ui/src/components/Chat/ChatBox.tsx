import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Message, StaffMessage } from "../../types";
import { useTicketStore } from "../../store/ticketStore";
import { useStaffChatStore } from "../../store/staffChatStore";

const ChatContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isCurrentUser" && prop !== "isStaff",
})<{ isCurrentUser?: boolean; isStaff?: boolean }>(
  ({ theme, isCurrentUser, isStaff }) => ({
    padding: theme.spacing(1.5),
    maxWidth: "80%",
    borderRadius: theme.spacing(2),
    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
    backgroundColor: isStaff
      ? theme.palette.primary.main
      : isCurrentUser
      ? theme.palette.secondary.main
      : theme.palette.background.paper,
    color: isStaff
      ? theme.palette.primary.contrastText
      : isCurrentUser
      ? theme.palette.secondary.contrastText
      : theme.palette.text.primary,
  })
);

const MessageInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface ChatBoxProps {
  ticketId?: string;
  isStaffChat?: boolean;
  height?: string | number;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  ticketId,
  isStaffChat = false,
  height = "500px",
}) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addMessage, getTicketById } = useTicketStore();
  const {
    addMessage: addStaffMessage,
    currentUserId,
    currentUserName,
  } = useStaffChatStore();

  const staffMessages = useStaffChatStore((state: any) => state.messages);
  const ticket = ticketId ? getTicketById(ticketId) : undefined;
  const messages = ticket?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [isStaffChat ? staffMessages : messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (isStaffChat) {
      const newMessage: StaffMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUserName,
        content: message,
        timestamp: Date.now(),
      };
      addStaffMessage(newMessage);
    } else if (ticketId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUserName,
        content: message,
        timestamp: Date.now(),
        isStaff: true,
      };
      addMessage(ticketId, newMessage);
    }

    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm", { locale: ptBR });
  };

  const displayMessages = isStaffChat ? staffMessages : messages;

  return (
    <ChatContainer elevation={3} sx={{ height }}>
      <MessagesContainer>
        {displayMessages.map((msg: Message | StaffMessage) => {
          const isCurrentUser = msg.senderId === currentUserId;
          const isStaffMember = "isStaff" in msg ? msg.isStaff : true;

          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: isCurrentUser ? "flex-end" : "flex-start",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexDirection: isCurrentUser ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isStaffMember ? "primary.main" : "secondary.main",
                    fontSize: "0.875rem",
                  }}
                >
                  {msg.senderName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {msg.senderName}
                </Typography>
              </Box>

              <MessageBubble
                isCurrentUser={isCurrentUser}
                isStaff={isStaffMember}
              >
                <Typography variant="body2">{msg.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    opacity: 0.7,
                    mt: 0.5,
                  }}
                >
                  {formatTimestamp(msg.timestamp)}
                </Typography>
              </MessageBubble>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <Divider />

      <MessageInputContainer>
        <TextField
          fullWidth
          placeholder="Digite sua mensagem..."
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          inputRef={inputRef}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          }}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          sx={{ minWidth: "56px", height: "56px" }}
        >
          <SendIcon />
        </Button>
      </MessageInputContainer>
    </ChatContainer>
  );
};

export default ChatBox;
