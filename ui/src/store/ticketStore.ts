import { create } from 'zustand';
import type { Message, Ticket } from '../types';
import { TicketStatus } from '../types';
import { fetchNui } from '../utils/fetchNui';

interface TicketState {
  tickets: Ticket[];
  currentTicketId: string | null;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  addMessage: (ticketId: string, message: Message) => void;
  assignTicket: (ticketId: string, staffId: number, staffName: string) => void;
  setCurrentTicket: (ticketId: string | null) => void;
  teleportToPlayer: (playerId: number) => void;
  getTicketById: (id: string) => Ticket | undefined;
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
}

// Dados mock para desenvolvimento
const mockTickets: Ticket[] = [
  {
    id: '1',
    playerId: 1,
    playerName: 'João Silva',
    title: 'Jogador usando hack',
    description: 'Vi um jogador voando próximo ao banco central',
    status: TicketStatus.OPEN,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    messages: [
      {
        id: '1',
        senderId: 1,
        senderName: 'João Silva',
        content: 'Ele está usando speedhack também',
        timestamp: Date.now() - 3000000,
        isStaff: false,
      }
    ]
  },
  {
    id: '2',
    playerId: 2,
    playerName: 'Maria Oliveira',
    title: 'Bug na loja de roupas',
    description: 'Não consigo comprar roupas na loja do centro',
    status: TicketStatus.IN_PROGRESS,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 1800000,
    messages: [
      {
        id: '1',
        senderId: 2,
        senderName: 'Maria Oliveira',
        content: 'Já tentei reiniciar o jogo e o problema persiste',
        timestamp: Date.now() - 7000000,
        isStaff: false,
      },
      {
        id: '2',
        senderId: 100,
        senderName: 'Admin Carlos',
        content: 'Estou verificando seu problema. Qual loja específica?',
        timestamp: Date.now() - 2000000,
        isStaff: true,
      }
    ],
    assignedTo: {
      id: 100,
      name: 'Admin Carlos'
    }
  },
  {
    id: '3',
    playerId: 3,
    playerName: 'Pedro Santos',
    title: 'Dúvida sobre empregos',
    description: 'Como faço para conseguir o emprego de mecânico?',
    status: TicketStatus.CLOSED,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 43200000,
    messages: [
      {
        id: '1',
        senderId: 3,
        senderName: 'Pedro Santos',
        content: 'Alguém pode me ajudar com isso?',
        timestamp: Date.now() - 86000000,
        isStaff: false,
      },
      {
        id: '2',
        senderId: 101,
        senderName: 'Admin Ana',
        content: 'Você precisa ir até a oficina e falar com o NPC responsável.',
        timestamp: Date.now() - 50000000,
        isStaff: true,
      },
      {
        id: '3',
        senderId: 3,
        senderName: 'Pedro Santos',
        content: 'Obrigado, consegui!',
        timestamp: Date.now() - 45000000,
        isStaff: false,
      }
    ],
    assignedTo: {
      id: 101,
      name: 'Admin Ana'
    }
  }
];

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: mockTickets,
  currentTicketId: null,
  
  addTicket: (ticket: Ticket) => {
    set((state: TicketState) => ({
      tickets: [...state.tickets, ticket]
    }));
    
    // TODO Enviar para back
    fetchNui('createTicket', { ticket }).catch(() => {});
  },
  
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => {
    set((state: TicketState) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: Date.now() } : ticket
      )
    }));
    
    // TODO Enviar para back
    fetchNui('updateTicket', { ticketId, updates }).catch(() => {});
  },
  
  updateTicketStatus: (ticketId: string, status: TicketStatus) => {
    set((state: TicketState) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId ? { ...ticket, status, updatedAt: Date.now() } : ticket
      )
    }));
    
    // TODO Enviar para back
    fetchNui('updateTicketStatus', { ticketId, status }).catch(() => {});
  },
  
  addMessage: (ticketId: string, message: Message) => {
    set((state: TicketState) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, message],
              updatedAt: Date.now()
            } 
          : ticket
      )
    }));
    
    // TODO Enviar para back
    fetchNui('addTicketMessage', { ticketId, message }).catch(() => {});
  },
  
  assignTicket: (ticketId: string, staffId: number, staffName: string) => {
    set((state: TicketState) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignedTo: { id: staffId, name: staffName },
              status: TicketStatus.IN_PROGRESS,
              updatedAt: Date.now()
            } 
          : ticket
      )
    }));
    
    // TODO Enviar para back
    fetchNui('assignTicket', { ticketId, staffId, staffName }).catch(() => {});
  },
  
  setCurrentTicket: (ticketId: string | null) => {
    set({ currentTicketId: ticketId });
  },
  
  teleportToPlayer: (playerId: number) => {
    // TODO Enviar para back
    fetchNui('teleportToPlayer', { playerId }).catch(() => {
      console.log('Erro ao tentar teleportar para o jogador');
    });
  },
  
  getTicketById: (id: string) => {
    return get().tickets.find(ticket => ticket.id === id);
  },
  
  getTicketsByStatus: (status: TicketStatus) => {
    return get().tickets.filter(ticket => ticket.status === status);
  }
})); 