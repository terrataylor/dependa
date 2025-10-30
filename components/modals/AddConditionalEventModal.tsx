'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddConditionalEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conditionalEvent: {
    conditionDate: Date;
    conditionDescription: string;
    todoItems: string[];
  }) => void;
}

export default function AddConditionalEventModal({ isOpen, onClose, onSave }: AddConditionalEventModalProps) {
  const [conditionDate, setConditionDate] = useState('');
  const [conditionDescription, setConditionDescription] = useState('');
  const [todoItems, setTodoItems] = useState<string[]>(['']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredTodos = todoItems.filter(item => item.trim() !== '');
    
    if (filteredTodos.length === 0) {
      alert('Please add at least one todo item');
      return;
    }

    onSave({
      conditionDate: new Date(conditionDate),
      conditionDescription,
      todoItems: filteredTodos,
    });
    
    // Reset form
    setConditionDate('');
    setConditionDescription('');
    setTodoItems(['']);
    onClose();
  };

  const addTodoItem = () => {
    setTodoItems([...todoItems, '']);
  };

  const removeTodoItem = (index: number) => {
    setTodoItems(todoItems.filter((_, i) => i !== index));
  };

  const updateTodoItem = (index: number, value: string) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index] = value;
    setTodoItems(newTodoItems);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Conditional Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Create a conditional event that will automatically add todos to your list when a specific condition is met.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition Date *
            </label>
            <input
              type="date"
              value={conditionDate}
              onChange={(e) => setConditionDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition Description *
            </label>
            <input
              type="text"
              value={conditionDescription}
              onChange={(e) => setConditionDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
              placeholder="e.g., If the house sells on this date"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: &quot;If the house sells&quot;, &quot;If project is approved&quot;
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Then add these todos: *
            </label>
            <div className="space-y-2">
              {todoItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateTodoItem(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                    placeholder="e.g., Plan estate sale"
                  />
                  {todoItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTodoItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTodoItem}
              className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" />
              Add another todo
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> When you mark the condition date as met, all the specified todos will automatically be added to your todo list.
            </p>
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
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Conditional Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

