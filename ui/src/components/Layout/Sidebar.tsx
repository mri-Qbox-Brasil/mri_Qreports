import React from "react";
import {
  Box,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import logo from "../../assets/img/logo.png";

// Define the menu items
const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Ver Reports", icon: <ConfirmationNumberIcon />, path: "/tickets" },
  { text: "Ranking Staff", icon: <EmojiEventsIcon />, path: "/ranking" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderRadius: 2,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          position: "relative",
        }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{
            width: 100,
            height: "auto",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </Toolbar>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? "primary.contrastText"
                    : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
