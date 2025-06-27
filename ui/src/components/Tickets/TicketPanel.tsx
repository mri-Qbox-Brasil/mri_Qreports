import React, { useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import TicketList from './TicketList';
import TicketDetails from './TicketDetails';
import { TicketStatus } from '../../types';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const TabPanel = (props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`ticket-tabpanel-${index}`}
      aria-labelledby={`ticket-tab-${index}`}
      sx={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `ticket-tab-${index}`,
    'aria-controls': `ticket-tabpanel-${index}`,
  };
};

const TicketPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>(undefined);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="ticket tabs"
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.875rem',
                lg: '1rem',
              },
              minHeight: {
                xs: '40px',
                sm: '48px',
              },
              padding: {
                xs: '6px 8px',
                sm: '6px 12px',
                md: '6px 16px',
              },
            }
          }}
        >
          <Tab 
            label="Todos" 
            {...a11yProps(0)} 
            sx={{ 
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
            }} 
          />
          <Tab 
            label="Abertos" 
            {...a11yProps(1)} 
            sx={{ 
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
            }} 
          />
          <Tab 
            label="Em Atendimento" 
            {...a11yProps(2)} 
            sx={{ 
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
              display: { xs: 'none', sm: 'flex' },
            }} 
          />
          <Tab 
            label={isMobile ? 'Em Atend.' : 'Em Atendimento'} 
            {...a11yProps(2)} 
            sx={{ 
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
              display: { xs: 'flex', sm: 'none' },
            }} 
          />
          <Tab 
            label="Fechados" 
            {...a11yProps(3)} 
            sx={{ 
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
            }} 
          />
        </Tabs>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        height: 'calc(100% - 48px)'
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          width: '40%', 
          height: '100%',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}>
          <TabPanel value={tabValue} index={0}>
            <TicketList 
              onSelectTicket={handleSelectTicket} 
              selectedTicketId={selectedTicketId}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TicketList 
              status={TicketStatus.OPEN} 
              onSelectTicket={handleSelectTicket}
              selectedTicketId={selectedTicketId}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TicketList 
              status={TicketStatus.IN_PROGRESS} 
              onSelectTicket={handleSelectTicket}
              selectedTicketId={selectedTicketId}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <TicketList 
              status={TicketStatus.CLOSED} 
              onSelectTicket={handleSelectTicket}
              selectedTicketId={selectedTicketId}
            />
          </TabPanel>
        </Box>

        <Box sx={{ 
          width: '60%', 
          height: '100%',
          overflow: 'hidden',
        }}>
          {selectedTicketId ? (
            <TicketDetails 
              ticketId={selectedTicketId} 
              onClose={() => setSelectedTicketId(undefined)}
            />
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
                p: 3,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Selecione um ticket para visualizar os detalhes
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default TicketPanel;
