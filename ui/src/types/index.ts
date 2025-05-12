export enum TicketStatus {
  OPEN = 'ABERTO',
  IN_PROGRESS = 'EM_ATENDIMENTO',
  CLOSED = 'FECHADO'
}

export interface Player {
  id: number;
  name: string;
  steamId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Message {
  id: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: number;
  isStaff: boolean;
}

export interface Ticket {
  id: string;
  playerId: number;
  playerName: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  assignedTo?: {
    id: number;
    name: string;
  };
}

export interface StaffMember {
  id: number;
  name: string;
  closedTickets: number;
  rating: number;
  isOnline: boolean;
}

export interface StaffMessage {
  id: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: number;
} 