/**
 * Client Management Page
 * File: /admin/clients/page.tsx
 * 
 * This page handles all client management functionality including:
 * - Viewing all clients in a table layout
 * - Adding new clients with logo upload
 * - Editing existing clients and their logos
 * - Deleting clients
 * - Viewing and managing projects for each client
 */

'use client';

// =============================================================================
// IMPORTS
// =============================================================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  RiAddLine, 
  RiEditLine, 
  RiDeleteBinLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiSearchLine,
  RiBuilding2Line,
  RiImageAddLine,
  RiImageEditLine
} from 'react-icons/ri';

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
  logo?: string; // Base64 encoded image or URL
}

interface Project {
  id: string;
  name: string;
  clientId: string;
  status: string;
  startDate: string;
  dueDate: string;
  budget: number;
  city: string;
  country: string;
  tags: string[];
}

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

// Add these mock data constants
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ben Shalom',
    email: 'contact@benshalom.com',
    company: 'Shalom Architects',
    phone: '+972 50-123-4567',
    projectCount: 4,
    status: 'active',
    lastActive: '2024-03-21',
    projects: ['1', '2'],
    logo: '' // You can add a default logo URL here if needed
  },
  {
    id: '2',
    name: 'Michal Design',
    email: 'michal@design.com',
    company: 'Michal Design Studio',
    phone: '+972 50-987-6543',
    projectCount: 2,
    status: 'active',
    lastActive: '2024-03-20',
    projects: ['3'],
    logo: '' // You can add a default logo URL here if needed
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Luxury Villa Project',
    clientId: '1',
    status: 'In Progress',
    startDate: '2024-03-01',
    dueDate: '2024-04-01',
    budget: 5000,
    city: 'Tel Aviv',
    country: 'Israel',
    tags: ['Interior Rendering', 'Exterior Rendering', 'Lighting Study']
  },
  {
    id: '2',
    name: 'Modern Office Complex',
    clientId: '1',
    status: 'Pending Approval',
    startDate: '2024-03-15',
    dueDate: '2024-04-15',
    budget: 7500,
    city: 'Jerusalem',
    country: 'Israel',
    tags: ['3D Model', 'Floor Plan', 'Virtual Tour']
  },
  {
    id: '3',
    name: 'Residential Project',
    clientId: '2',
    status: 'Materials Received',
    startDate: '2024-03-20',
    dueDate: '2024-04-20',
    budget: 4000,
    city: 'Haifa',
    country: 'Israel',
    tags: ['Interior Rendering', 'Material Selection']
  }
];

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * ImageUpload Component
 * Handles logo upload and preview functionality
 */
const ImageUpload = ({ 
  currentImage, 
  onImageChange 
}: { 
  currentImage?: string;
  onImageChange: (base64: string) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-400 mb-2">Company Logo</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden">
          {currentImage ? (
            <img 
              src={currentImage} 
              alt="Company logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <RiImageAddLine className="text-3xl" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {currentImage ? 'Change Logo' : 'Upload Logo'}
          </label>
          {currentImage && (
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="ml-2 px-4 py-2 text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Recommended: Square image, max 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * AddClientModal Component
 * Handles the creation of new clients
 */
const AddClientModal = ({ 
  isOpen, 
  onClose,
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onAdd: (client: Client) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    logo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      logo: formData.logo,
      projectCount: 0,
      status: 'active',
      lastActive: new Date().toISOString().split('T')[0],
      projects: []
    };
    onAdd(newClient);
    setFormData({ name: '', email: '', company: '', phone: '', logo: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Client</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            currentImage={formData.logo}
            onImageChange={(base64) => setFormData({ ...formData, logo: base64 })}
          />

          <div>
            <label className="block text-sm text-gray-400 mb-2">Client Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Add Client
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/**
 * EditClientModal Component
 * Handles the editing of existing clients
 */
const EditClientModal = ({ 
  isOpen, 
  onClose, 
  onEdit,
  client 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onEdit: (id: string, updatedClient: Client) => void;
  client: Client;
}) => {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    company: client.company,
    phone: client.phone,
    logo: client.logo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(client.id, {
      ...client,
      ...formData
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Client</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            currentImage={formData.logo}
            onImageChange={(base64) => setFormData({ ...formData, logo: base64 })}
          />

          <div>
            <label className="block text-sm text-gray-400 mb-2">Client Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/**
 * DeleteConfirmationModal Component
 * Displays a confirmation dialog before deleting a client
 */
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  clientName 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Delete Client</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white">{clientName}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * ClientProjectsModal Component
 * Displays all projects associated with a client
 */
const ClientProjectsModal = ({ 
  isOpen, 
  onClose, 
  client,
  projects 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  client: Client;
  projects: Project[];
}) => {
  if (!isOpen) return null;

  const clientProjects = projects.filter(project => 
    client.projects.includes(project.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden">
              {client.logo ? (
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <RiBuilding2Line className="text-2xl" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{client.name}</h2>
              <p className="text-gray-400 text-sm">{client.company}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {clientProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No projects found for this client.</p>
            <button
              onClick={() => {
                // TODO: Implement "Add New Project" functionality
                console.log('Add new project for client:', client.id);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Add New Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {clientProjects.map(project => (
              <div 
                key={project.id}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-400">
                    {project.city}, {project.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {project.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    PROJECT_STATUSES[project.status as keyof typeof PROJECT_STATUSES]
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-gray-400">
                    ${project.budget.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      // TODO: Implement project edit functionality
                      console.log('Edit project:', project.id);
                    }}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <RiEditLine />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * ClientsPage Component
 * Main component for the clients management page
 */
export default function ClientsPage() {
  // State management
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [viewingClientProjects, setViewingClientProjects] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleAddClient = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
  };

  const handleEditClient = (id: string, updatedClient: Client) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === id ? updatedClient : client
      )
    );
  };

  const handleDeleteClient = (id: string) => {
    setClients(prevClients => 
      prevClients.filter(client => client.id !== id)
    );
    setDeletingClient(null);
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Clients Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <RiAddLine />
          Add New Client
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4 text-gray-400">Name</th>
              <th className="text-left p-4 text-gray-400">Company</th>
              <th className="text-left p-4 text-gray-400">Email</th>
              <th className="text-left p-4 text-gray-400">Projects</th>
              <th className="text-left p-4 text-gray-400">Status</th>
              <th className="text-left p-4 text-gray-400">Last Active</th>
              <th className="text-left p-4 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-700/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {client.logo ? (
                        <img 
                          src={client.logo} 
                          alt={`${client.name} logo`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <RiBuilding2Line className="text-xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-400">{client.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{client.company}</td>
                <td className="p-4 text-gray-400">{client.email}</td>
                <td className="p-4">
                  <button
                    onClick={() => setViewingClientProjects(client)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {client.projectCount} Projects
                  </button>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    client.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{client.lastActive}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/clients/${client.id}/projects`}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <RiFileList3Line className="text-xl" />
                    </Link>
                    <button 
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setEditingClient(client)}
                    >
                      <RiEditLine className="text-xl" />
                    </button>
                    <button 
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      onClick={() => setDeletingClient(client)}
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddClientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
      />

      {editingClient && (
        <EditClientModal
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          onEdit={handleEditClient}
          client={editingClient}
        />
      )}

      {deletingClient && (
        <DeleteConfirmationModal
          isOpen={!!deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={() => handleDeleteClient(deletingClient.id)}
          clientName={deletingClient.name}
        />
      )}

      {viewingClientProjects && (
        <ClientProjectsModal
          isOpen={!!viewingClientProjects}
          onClose={() => setViewingClientProjects(null)}
          client={viewingClientProjects}
          projects={MOCK_PROJECTS}
        />
      )}
    </div>
  );
}