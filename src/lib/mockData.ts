'use client';

// Types & Interfaces
export const PROJECT_STATUSES = {
  'Materials Received': 'bg-gray-600',
  'In Progress': 'bg-blue-600/30 text-blue-400',
  'Pending Approval': 'bg-yellow-600/30 text-yellow-400',
  'In Review': 'bg-purple-600/30 text-purple-400',
  'Revisions': 'bg-orange-600/30 text-orange-400',
  'Completed': 'bg-green-600/30 text-green-400'
} as const;

export const PROJECT_TIERS = {
  'Bronze': {
    min: 0,
    max: 5,
    color: 'from-[#CD7F32] to-[#B87333]'
  },
  'Silver': {
    min: 6,
    max: 15,
    color: 'from-[#C0C0C0] to-[#A8A8A8]'
  },
  'Gold': {
    min: 16,
    max: 30,
    color: 'from-[#FFD700] to-[#FFA500]'
  },
  'Platinum': {
    min: 31,
    max: Infinity,
    color: 'from-[#E5E4E2] to-[#A9A8A7]'
  }
} as const;

export const PROJECT_TAGS = [
  'Interior Rendering',
  'Exterior Rendering',
  'Animation',
  'Virtual Tour',
  'Floor Plan',
  'Site Plan',
  'Aerial View',
  'Street View',
  '3D Model',
  'Material Selection',
  'Lighting Study',
  'Furniture Layout',
  'Landscape Visualization' // Added this as it's used in mock data
] as const;

export type ProjectStatus = keyof typeof PROJECT_STATUSES;
export type ProjectTag = typeof PROJECT_TAGS[number];

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  city: string;
  country: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  budget: number;
  isPaid: boolean;
  thumbnailUrl: string;
  tags: ProjectTag[];
  lastUpdate: string;  // Add this line
}

// Make sure MOCK_PROJECTS is properly typed and exported
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Michal Project',
    clientId: '1',
    clientName: 'Ben Shalom',
    city: 'Tel Aviv',
    country: 'Israel',
    status: 'In Progress' as ProjectStatus,
    startDate: '2024-03-01',
    dueDate: '2024-04-01',
    budget: 5000,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=1',
    tags: ['Interior Rendering', 'Furniture Layout', 'Lighting Study'] as ProjectTag[],
	    lastUpdate: '2024-03-15'  // Add this line
  },
  {
    id: '2',
    name: 'Shafer Building',
    clientId: '1',
    clientName: 'Ben Shalom',
    city: 'Herzliya',
    country: 'Israel',
    status: 'Completed' as ProjectStatus,
    startDate: '2024-02-15',
    dueDate: '2024-03-15',
    budget: 7500,
    isPaid: true,
    thumbnailUrl: 'https://picsum.photos/800/600?random=2',
    tags: ['Exterior Rendering', 'Animation'] as ProjectTag[],
	    lastUpdate: '2024-03-15'  // Add this line
  },
  {
    id: '3',
    name: 'Garden Villa',
    clientId: '1',
    clientName: 'Ben Shalom',
    city: 'Ramat Gan',
    country: 'Israel',
    status: 'In Review' as ProjectStatus,
    startDate: '2024-03-10',
    dueDate: '2024-04-10',
    budget: 6000,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=3',
    tags: ['Virtual Tour'] as ProjectTag[],
    lastUpdate: '2024-03-15'  // Add this line	
  },
  {
    id: '4',
    name: 'Urban Loft',
    clientId: '1',
    clientName: 'Ben Shalom',
    city: 'Jerusalem',
    country: 'Israel',
    status: 'Materials Received' as ProjectStatus,
    startDate: '2024-03-20',
    dueDate: '2024-04-20',
    budget: 4500,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=4',
    tags: ['Interior Rendering', 'Furniture Layout'] as ProjectTag[],
	    lastUpdate: '2024-03-15'  // Add this line
  }
];