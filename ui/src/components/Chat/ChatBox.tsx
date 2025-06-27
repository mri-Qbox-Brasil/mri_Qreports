import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Popover,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
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
  position: "relative",
  overflow: "hidden",
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  height: "calc(100% - 64px)",
  maxHeight: "calc(100% - 64px)",
  minHeight: "calc(100% - 64px)",
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(255, 255, 255, 0.5)',
  },
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
    wordBreak: "break-word",
  })
);

const MessageInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  overflowY: "hidden",
  height: "64px",
  minHeight: "64px",
  maxHeight: "64px",
  boxSizing: "border-box",
}));

// TODO alterar pra algum componente de emoji picker mais robusto
const commonEmojis = [
  "😀", "😂", "😊", "😍", "🤔", "😎", "👍", "👎", "👏", "🙏",
  "❤️", "🔥", "⭐", "🎮", "🚗", "🏠", "🌍", "🍕", "🍺", "🎉",
  "😢", "😡", "🤮", "🤑", "🤯", "🥳", "🤠", "👮", "🚓", "🚨",
];

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
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setEmojiAnchorEl(null);
    inputRef.current?.focus();
  };
  
  const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  
  const handleCloseEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  const { addMessage, getTicketById } = useTicketStore();
  const {
    addMessage: addStaffMessage,
    currentUserId,
    currentUserName,
  } = useStaffChatStore();

  const staffMessages = useStaffChatStore((state) => state.messages);
  const ticket = ticketId ? getTicketById(ticketId) : undefined;
  const messages = ticket?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentMessages = isStaffChat ? staffMessages : messages;
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

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
    <ChatContainer elevation={3} sx={{ height: height || "400px", display: 'flex', flexDirection: 'column'}}>
      <MessagesContainer>
        {displayMessages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma mensagem ainda. Comece a conversa!
            </Typography>
          </Box>
        ) : (
          displayMessages.map((msg: Message | StaffMessage) => {
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
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                    maxWidth: "100%",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: isStaffMember ? "primary.main" : "secondary.main",
                      fontSize: "0.875rem",
                      flexShrink: 0,
                    }}
                  >
                    {msg.senderName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: "150px" }}>
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
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageInputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          inputRef={inputRef}
          size="small"
          InputProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            endAdornment: (
              <IconButton onClick={handleOpenEmojiPicker} size="small" sx={{ color: 'gray' }}>
                <EmojiEmotionsIcon />
              </IconButton>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{
            borderRadius: 3,
            minWidth: "auto",
            px: 2,
          }}
        >
          <SendIcon />
        </Button>
        
        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={handleCloseEmojiPicker}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {commonEmojis.map((emoji) => (
                <Button 
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  sx={{ minWidth: 40, fontSize: '1.6rem' }}
                >
                  {emoji}
                </Button>
              ))}
            </Box>
          </Box>
        </Popover>
      </MessageInputContainer>
    </ChatContainer>
  );
};

export default ChatBox;
