export type SessionCategory = 'Keynote' | 'Deep Dive' | 'Workshop' | 'Panel';
export type SessionTrack = 'AI & ML' | 'Cloud Native' | 'Frontend' | 'DevOps' | 'Security';
export type SessionStatus = 'Pending' | 'Accepted' | 'Rejected';

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

export interface Session {
  id: string;
  title: string;
  abstract: string;
  speakerId: string;
  category: SessionCategory;
  track: SessionTrack;
  status: SessionStatus;
  aiScores?: {
    relevance: number;
    clarity: number;
    technicalDepth: number;
  };
  aiFeedback?: string;
  scheduledAt?: string; // e.g., '2024-10-26T09:00:00'
  scheduledRoom?: string; // e.g., 'Room A'
}

export interface Feedback {
  sessionId: string;
  rating: number; // 1-5
  comment: string;
}
