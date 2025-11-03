'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '@/lib/types';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: {
    title: string;
    description: string;
    assignedTo?: string;
    assignedToEmail?: string;
    dueDate?: Date;
  }) => void;
  sharedUsers: User[];
}

export default function AddTodoModal({ isOpen, onClose, onSave, sharedUsers }: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignedUser = sharedUsers.find(u => u.uid === assignedTo);
    
    onSave({
      title,
      description,
      assignedTo: assignedTo || undefined,
      assignedToEmail: assignedUser?.email,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Todo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
              placeholder="e.g., Plan estate sale"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
              placeholder="Add details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
            >
              <option value="">Not assigned</option>
              {sharedUsers.map(user => (
                <option key={user.uid} value={user.uid}>
                  {user.displayName || user.email}
                </option>
              ))}
            </select>
            {sharedUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Share your calendar to assign tasks to others
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

