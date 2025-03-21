'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RiAddLine, 
  RiEditLine, 
  RiDeleteBinLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiArrowLeftLine,
  RiBuilding2Line,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine
} from 'react-icons/ri';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================
interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  projectCount: number;
  status: 'active' | 'inactive';
  lastActive: string;
  projects: string[]; // Array of project IDs
}

interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  budget: number;
  isPaid: boolean;
  thumbnailUrl: string;
  tags: ProjectTag[];
  city: string;    // Added
  country: string; // Added
}

type ProjectStatus = keyof typeof PROJECT_STATUSES;
type ProjectTag = typeof PROJECT_TAGS[number];

// =============================================================================
// CONSTANTS
// =============================================================================
const PROJECT_STATUSES = {
  'Materials Received': 'bg-gray-600',
  'In Progress': 'bg-blue-600/30 text-blue-400',
  'Pending Approval': 'bg-yellow-600/30 text-yellow-400',
  'In Review': 'bg-purple-600/30 text-purple-400',
  'Revisions': 'bg-orange-600/30 text-orange-400',
  'Completed': 'bg-green-600/30 text-green-400'
} as const;

const PROJECT_TAGS = [
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
  'Furniture Layout'
] as const;

// =============================================================================
// MOCK DATA
// =============================================================================
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: 'Ben Shalom',
    email: 'contact@benshalom.com',
    company: 'Shalom Architects',
    phone: '+972 50-123-4567',
    projectCount: 4,
    status: 'active',
    lastActive: '2024-03-21',
    projects: ['1', '2']
  },
  {
    id: "2",
    name: 'Michal Design',
    email: 'michal@design.com',
    company: 'Michal Design Studio',
    phone: '+972 50-987-6543',
    projectCount: 2,
    status: 'active',
    lastActive: '2024-03-20',
    projects: ['3']
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Luxury Villa Project',
    clientId: '1',
    clientName: 'Ben Shalom',
    status: 'In Progress',
    startDate: '2024-03-01',
    dueDate: '2024-04-01',
    budget: 5000,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=1',
    tags: ['Interior Rendering', 'Exterior Rendering', 'Lighting Study'],
    city: 'Tel Aviv',
    country: 'Israel'
  },
  {
    id: '2',
    name: 'Modern Office Complex',
    clientId: '1',
    clientName: 'Ben Shalom',
    status: 'Pending Approval',
    startDate: '2024-03-15',
    dueDate: '2024-04-15',
    budget: 7500,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=2',
    tags: ['3D Model', 'Floor Plan', 'Virtual Tour'],
    city: 'Jerusalem',
    country: 'Israel'
  },
  {
    id: '3',
    name: 'Residential Project',
    clientId: '2',
    clientName: 'Michal Design',
    status: 'Materials Received',
    startDate: '2024-03-20',
    dueDate: '2024-04-20',
    budget: 4000,
    isPaid: false,
    thumbnailUrl: 'https://picsum.photos/800/600?random=3',
    tags: ['Interior Rendering', 'Material Selection'],
    city: 'Haifa',
    country: 'Israel'
  }
];

// =============================================================================
// COMPONENTS
// =============================================================================
// AddProjectModal Component
const AddProjectModal = ({ isOpen, onClose, onAdd, clientId, clientName }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
  clientId: string;
  clientName: string;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Materials Received' as ProjectStatus,
    startDate: '',
    dueDate: '',
    budget: 0,
    tags: [] as ProjectTag[],
    thumbnailUrl: 'https://picsum.photos/800/600?random=' + Math.random(),
    city: '',    // Added
    country: ''  // Added
  });

  const handleTagToggle = (tag: ProjectTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tags.length === 0) {
      alert('Please select at least one deliverable');
      return;
    }
    onAdd({
      id: Date.now().toString(),
      clientId,
      clientName,
      ...formData,
      isPaid: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
            >
              {Object.keys(PROJECT_STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          {/* Budget Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
              min="0"
            />
          </div>

          {/* Project Deliverables */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Deliverables
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length === 0 && (
              <p className="text-red-400 text-sm mt-2">Please select at least one deliverable</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EditProjectModal Component
const EditProjectModal = ({ isOpen, onClose, onEdit, project }: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
  project: Project;
}) => {
  const [formData, setFormData] = useState({
    name: project.name,
    status: project.status,
    startDate: project.startDate,
    dueDate: project.dueDate,
    budget: project.budget,
    tags: project.tags,
    thumbnailUrl: project.thumbnailUrl,
    city: project.city,       // Added
    country: project.country  // Added
  });

  const handleTagToggle = (tag: ProjectTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tags.length === 0) {
      alert('Please select at least one deliverable');
      return;
    }
    onEdit({
      ...project,
      ...formData
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
            >
              {Object.keys(PROJECT_STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          {/* Budget Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
              min="0"
            />
          </div>

          {/* Project Deliverables */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Deliverables
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length === 0 && (
              <p className="text-red-400 text-sm mt-2">Please select at least one deliverable</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// DeleteConfirmationModal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectName }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete Project</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the project "{projectName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ClientProjectsContent() {
  const params = useParams();
  const clientId = params.clientId as string;
  
  console.log('Current clientId:', clientId, 'type:', typeof clientId);
  console.log('MOCK_CLIENTS:', MOCK_CLIENTS.map(c => ({ id: c.id, type: typeof c.id })));
  
  // Find the client from mock data with string comparison
  const client = MOCK_CLIENTS.find(c => 
    c.id === clientId || c.id === String(clientId) || String(c.id) === String(clientId)
  );
  
  console.log('Found client:', client);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin/clients"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <RiArrowLeftLine className="text-xl" />
            Back to Clients
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h1 className="text-xl font-bold text-red-400">Client not found</h1>
          <p className="text-gray-400 mt-2">
            Could not find client with ID: {clientId}
          </p>
          <pre className="mt-4 p-4 bg-gray-900 rounded-lg overflow-auto">
            <code>
              {JSON.stringify({ params, clientId, availableIds: MOCK_CLIENTS.map(c => c.id) }, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  // Filter projects for this client
  const [projects, setProjects] = useState<Project[]>(
    MOCK_PROJECTS.filter(p => String(p.clientId) === String(clientId))
  );

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handlers
  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleEditProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/clients"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <RiArrowLeftLine className="text-xl" />
          Back to Clients
        </Link>
      </div>

      {/* Client Information */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{client.name}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <RiBuilding2Line />
                <span>{client.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiMailLine />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiPhoneLine />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <RiAddLine />
            Add New Project
          </button>
        </div>
      </div>
{/* Projects Grid or Empty State */}
{projects.length === 0 ? (
  // Empty State
  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-12 text-center">
    <div className="w-48 h-48 mb-6 flex items-center justify-center bg-gray-700/50 rounded-full">
      <RiFileList3Line className="w-24 h-24 text-gray-600" />
    </div>
    <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
    <p className="text-gray-400 mb-8 max-w-md">
      Start creating amazing projects for {client.name}. Click the button below to add your first project.
    </p>
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-lg"
    >
      <RiAddLine className="text-xl" />
      Add First Project
    </button>
  </div>
) : (
  // Existing Projects Grid
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map(project => (
      <div key={project.id} className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="relative h-48">
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => {
                setSelectedProject(project);
                setIsEditModalOpen(true);
              }}
              className="p-2 bg-gray-800/80 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RiEditLine className="text-xl" />
            </button>
            <button
              onClick={() => {
                setSelectedProject(project);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 bg-gray-800/80 rounded-lg hover:bg-red-600 transition-colors"
            >
              <RiDeleteBinLine className="text-xl" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-sm ${PROJECT_STATUSES[project.status]}`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <RiFileList3Line />
              <span>{project.tags.length} deliverables</span>
            </div>
            <div className="flex items-center gap-1">
              <RiMoneyDollarCircleLine />
              <span>${project.budget.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <RiMapPinLine />
              <span>{project.city}, {project.country}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProject}
        clientId={clientId}
        clientName={client.name}
      />

      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEditProject}
            project={selectedProject}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              handleDeleteProject(selectedProject.id);
              setIsDeleteModalOpen(false);
            }}
            projectName={selectedProject.name}
          />
        </>
      )}
    </div>
  );
}