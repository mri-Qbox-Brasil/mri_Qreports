import { create } from 'zustand';
import type { StaffMember, StaffMessage } from '../types';
import { fetchNui } from '../utils/fetchNui';

interface StaffChatState {
  messages: StaffMessage[];
  staffMembers: StaffMember[];
  currentUserId: number;
  currentUserName: string;
  isStaff: boolean;
  
  addMessage: (message: StaffMessage) => void;
  setCurrentUser: (id: number, name: string, isStaff: boolean) => void;
  updateStaffMember: (memberId: number, updates: Partial<StaffMember>) => void;
}

// Dados mock para desenvolvimento
const mockStaffMessages: StaffMessage[] = [
  {
    id: '1',
    senderId: 100,
    senderName: 'Admin Carlos',
    content: 'Bom dia equipe, vamos focar nos reports de hack hoje',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    senderId: 101,
    senderName: 'Admin Ana',
    content: 'Ok, estou trabalhando nos tickets de bugs também',
    timestamp: Date.now() - 3500000,
  },
  {
    id: '3',
    senderId: 102,
    senderName: 'Moderador Lucas',
    content: 'Preciso de ajuda com um jogador problemático na área do banco',
    timestamp: Date.now() - 1800000,
  }
];

const mockStaffMembers: StaffMember[] = [
  {
    id: 100,
    name: 'Admin Carlos',
    closedTickets: 125,
    rating: 4.8,
    isOnline: true,
  },
  {
    id: 101,
    name: 'Admin Ana',
    closedTickets: 97,
    rating: 4.9,
    isOnline: true,
  },
  {
    id: 102,
    name: 'Moderador Lucas',
    closedTickets: 64,
    rating: 4.5,
    isOnline: true,
  },
  {
    id: 103,
    name: 'Moderador Júlia',
    closedTickets: 42,
    rating: 4.6,
    isOnline: false,
  }
];

export const useStaffChatStore = create<StaffChatState>((set) => ({
  messages: mockStaffMessages,
  staffMembers: mockStaffMembers,
  currentUserId: 100, // Valor padrão DEV
  currentUserName: 'Admin Carlos', // Valor padrão DEV
  isStaff: true, // Valor padrão DEV
  
  addMessage: (message: StaffMessage) => {
    set((state: StaffChatState) => ({
      messages: [...state.messages, message]
    }));
    
    // TODO Enviar para back
    fetchNui('sendStaffMessage', { message }).catch(() => {});
  },
  
  setCurrentUser: (id: number, name: string, isStaff: boolean) => {
    set({
      currentUserId: id,
      currentUserName: name,
      isStaff
    });
  },
  
  updateStaffMember: (memberId: number, updates: Partial<StaffMember>) => {
    set((state: StaffChatState) => ({
      staffMembers: state.staffMembers.map((member) => 
        member.id === memberId ? { ...member, ...updates } : member
      )
    }));
    
    // TODO Enviar para back
    fetchNui('updateStaffMember', { memberId, updates }).catch(() => {});
  }
})); 