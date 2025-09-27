
export type SessionCategory = 'Keynote' | 'Deep Dive' | 'Workshop' | 'Panel';
export type SessionTrack = 'AI & ML' | 'Cloud Native' | 'Frontend' | 'DevOps' | 'Security';
export type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface Speaker {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  availabilityConfirmed: boolean;
  presentationUploaded: boolean;
  checkedIn: boolean;
}

export interface AgendaSlot {
  id: string;
  title: string;
  description: string;
  track: SessionTrack;
  room: string;
  time: string;
  status: 'Open' | 'Conflict' | 'Filled';
  acceptedProposalId?: string;
}

export interface Proposal {
  id: string;
  slotId: string;
  speakerId: string;
  title: string;
  abstract: string;
  status: ProposalStatus;
  aiScores?: {
    relevance: number;
    clarity: number;
    technicalDepth: number;
  };
  aiFeedback?: string;
}

export interface Feedback {
  sessionId: string; // This would now link to an AgendaSlot's acceptedProposalId
  rating: number; // 1-5
  comment: string;
}
