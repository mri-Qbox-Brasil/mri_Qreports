import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useStaffChatStore } from "../../store/staffChatStore";

const RankingContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
}));

const RankingHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  "& > td": {
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  color: "text.primary",
}));

const TrophyIcon = styled(EmojiEventsIcon)<{ position: number }>(
  ({ position }) => {
    let color;
    switch (position) {
      case 1:
        color = "#FFD700";
        break;
      case 2:
        color = "#C0C0C0";
        break;
      case 3:
        color = "#CD7F32";
        break;
      default:
        color = "transparent";
    }

    return {
      color,
      fontSize: position <= 3 ? "1.5rem" : "1rem",
    };
  }
);

const StaffRanking: React.FC = () => {
  const staffMembers = useStaffChatStore((state: any) => state.staffMembers);

  const sortedStaff = [...staffMembers].sort(
    (a, b) => b.closedTickets - a.closedTickets
  );

  return (
    <Box>
      <RankingContainer elevation={3}>
        <RankingHeader>
          <Typography variant="h5" fontWeight={600}>
            Ranking da Staff
          </Typography>
          <EmojiEventsIcon color="primary" sx={{ fontSize: "2rem" }} />
        </RankingHeader>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                <StyledTableCell align="center" width={60}>
                  #
                </StyledTableCell>
                <StyledTableCell>Staff</StyledTableCell>
                <StyledTableCell align="center">
                  Tickets Fechados
                </StyledTableCell>
                <StyledTableCell align="center">Avaliação</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStaff.map((member, index) => (
                <StyledTableRow key={member.id}>
                  <StyledTableCell align="center">
                    {index < 3 ? (
                      <TrophyIcon position={index + 1} />
                    ) : (
                      index + 1
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body1">{member.name}</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography variant="body1" fontWeight={600}>
                      {member.closedTickets}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      <Rating
                        value={member.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2">
                        ({member.rating.toFixed(1)})
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label={member.isOnline ? "Online" : "Offline"}
                      size="small"
                      color={member.isOnline ? "success" : "default"}
                      variant={member.isOnline ? "filled" : "outlined"}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </RankingContainer>
    </Box>
  );
};

export default StaffRanking;
