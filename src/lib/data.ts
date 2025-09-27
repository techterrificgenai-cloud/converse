
import type { Speaker, AgendaSlot, Proposal, Feedback } from './types';

export const speakers: Speaker[] = [
  {
    id: 'sp_01',
    name: 'Alice',
    email: 'alice@example.com',
    bio: 'Expert in AI ethics and responsible AI development.',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
    availabilityConfirmed: false,
    presentationUploaded: false,
    checkedIn: false,
  },
  {
    id: 'sp_02',
    name: 'Bob',
    email: 'bob@example.com',
    bio: 'Leading researcher in the application of AI in medical fields.',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
    availabilityConfirmed: false,
    presentationUploaded: false,
    checkedIn: false,
  },
  {
    id: 'sp_03',
    name: 'Charlie',
    email: 'charlie@example.com',
    bio: 'Cloud infrastructure architect with a focus on green computing.',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    availabilityConfirmed: false,
    presentationUploaded: false,
    checkedIn: false,
  },
];

export const agendaSlots: AgendaSlot[] = [
  {
    id: 'slot_01',
    title: 'The Future of AI',
    description: 'A keynote session exploring the next frontier of Artificial Intelligence, from large language models to autonomous systems.',
    track: 'AI & ML',
    room: 'Hall A',
    time: '09:00',
    status: 'Conflict',
  },
  {
    id: 'slot_02',
    title: 'Sustainable Cloud Practices',
    description: 'A deep dive into building and maintaining environmentally friendly cloud infrastructures.',
    track: 'Cloud Native',
    room: 'Hall B',
    time: '10:00',
    status: 'Open',
  },
  {
    id: 'slot_03',
    title: 'Web3 & Security',
    description: 'Exploring the security challenges and opportunities in the decentralized web.',
    track: 'Security',
    room: 'Hall C',
    time: '11:00',
    status: 'Filled',
    acceptedProposalId: 'prop_03'
  },
];

export const proposals: Proposal[] = [
  // Conflict for Slot 1
  {
    id: 'prop_01',
    slotId: 'slot_01',
    speakerId: 'sp_01', // Alice
    title: 'Ethical AI Systems',
    abstract: 'A deep dive into designing and implementing AI systems that are fair, transparent, and accountable. We will cover frameworks for ethical assessment and mitigation of bias.',
    status: 'Pending',
    aiScores: { relevance: 9, clarity: 9, technicalDepth: 8 },
    aiFeedback: 'Excellent proposal that directly addresses a critical and timely aspect of AI. The focus on actionable frameworks is a significant strength.',
  },
  {
    id: 'prop_02',
    slotId: 'slot_01',
    speakerId: 'sp_02', // Bob
    title: 'AI in Healthcare',
    abstract: 'This session will showcase the latest breakthroughs in using AI for diagnostics, drug discovery, and personalized medicine, including case studies and future outlook.',
    status: 'Pending',
    aiScores: { relevance: 8, clarity: 8, technicalDepth: 9 },
    aiFeedback: 'Strong, technically deep proposal with high impact potential. Connects well with the "Future of AI" theme by showcasing a real-world application.',
  },
   // Filled Slot 3
   {
    id: 'prop_03',
    slotId: 'slot_03',
    speakerId: 'sp_03', // Charlie
    title: 'Securing Smart Contracts',
    abstract: 'An analysis of common vulnerabilities in smart contracts and best practices for writing secure, robust decentralized applications.',
    status: 'Accepted',
    aiScores: { relevance: 9, clarity: 9, technicalDepth: 9 },
    aiFeedback: 'Perfectly aligned with the slot description. Highly technical and relevant for the target audience.',
  },
];


// Legacy data, to be refactored or removed. For now, helps other components not to break.
export const sessions: any[] = proposals.map(p => {
    const slot = agendaSlots.find(s => s.id === p.slotId);
    const speaker = speakers.find(s => s.id === p.speakerId);
    return {
        id: p.id,
        title: p.title,
        abstract: p.abstract,
        speakerId: p.speakerId,
        category: 'Deep Dive',
        track: slot?.track,
        status: p.status,
        aiScores: p.aiScores,
        aiFeedback: p.aiFeedback,
        scheduledAt: `2024-10-26T${slot?.time}:00`,
        scheduledRoom: slot?.room,
    }
});


export const feedback: Feedback[] = [
  {
    sessionId: 'prop_03',
    rating: 5,
    comment: 'Excellent session, very informative and practical.',
  },
];
