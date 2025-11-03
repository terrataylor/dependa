'use client';

import React, { useState } from 'react';
import { Plus, Upload, User, CheckCircle2, Circle, FileText } from 'lucide-react';
import type { TodoItem, User as UserType } from '@/lib/types';

interface TodoListProps {
  todos: TodoItem[];
  currentUser?: UserType;
  sharedUsers: UserType[];
  onAddTodo: () => void;
  onToggleTodo: (todoId: string, completed: boolean) => void;
  onUploadProof: (todoId: string) => void;
  onAssignUser: (todoId: string, userId: string) => void;
  onTodoClick: (todo: TodoItem) => void;
}

export default function TodoList({
  todos,
  currentUser,
  sharedUsers,
  onAddTodo,
  onToggleTodo,
  onUploadProof,
  onAssignUser,
  onTodoClick,
}: TodoListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodos = filteredTodos.filter(t => !t.completed);
  const completedTodos = filteredTodos.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">To Do List</h2>
        <button
          onClick={onAddTodo}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {(['all', 'active', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`
              px-4 py-2 font-medium capitalize transition-colors
              ${filter === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks {filter !== 'all' && filter}
          </div>
        ) : (
          <>
            {/* Active Todos */}
            {activeTodos.length > 0 && (
              <div className="space-y-2">
                {activeTodos.map(todo => (
                  <TodoItemComponent
                    key={todo.id}
                    todo={todo}
                    sharedUsers={sharedUsers}
                    onToggleTodo={onToggleTodo}
                    onUploadProof={onUploadProof}
                    onAssignUser={onAssignUser}
                    onTodoClick={onTodoClick}
                  />
                ))}
              </div>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Completed</h3>
                {completedTodos.map(todo => (
                  <TodoItemComponent
                    key={todo.id}
                    todo={todo}
                    sharedUsers={sharedUsers}
                    onToggleTodo={onToggleTodo}
                    onUploadProof={onUploadProof}
                    onAssignUser={onAssignUser}
                    onTodoClick={onTodoClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TodoItemComponent({
  todo,
  sharedUsers,
  onToggleTodo,
  onUploadProof,
  onAssignUser,
  onTodoClick,
}: {
  todo: TodoItem;
  sharedUsers: UserType[];
  onToggleTodo: (todoId: string, completed: boolean) => void;
  onUploadProof: (todoId: string) => void;
  onAssignUser: (todoId: string, userId: string) => void;
  onTodoClick: (todo: TodoItem) => void;
}) {
  const assignedUser = sharedUsers.find(u => u.uid === todo.assignedTo);

  return (
    <div
      className={`
        p-3 border rounded-lg transition-all hover:shadow-md
        ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleTodo(todo.id, !todo.completed)}
          className="mt-0.5"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            onClick={() => onTodoClick(todo)}
            className="cursor-pointer"
          >
            <h4 className={`
              font-medium
              ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}
            `}>
              {todo.title}
            </h4>
            {todo.description && (
              <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Assigned User Dropdown - Always show */}
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-500" />
              <select
                value={todo.assignedTo || ''}
                onChange={(e) => onAssignUser(todo.id, e.target.value)}
                className={`
                  text-xs px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none
                  ${todo.assignedTo 
                    ? 'border-blue-300 bg-blue-50 text-blue-700 font-medium' 
                    : 'border-gray-300 bg-white text-gray-600'
                  }
                `}
              >
                <option value="">Assign to...</option>
                {sharedUsers.map(user => (
                  <option key={user.uid} value={user.uid}>
                    {user.displayName || user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Proof Button */}
            {todo.completed && !todo.proofOfCompletionUrl && (
              <button
                onClick={() => onUploadProof(todo.id)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Upload className="w-3 h-3" />
                Upload Proof
              </button>
            )}

            {/* Has Proof Indicator */}
            {todo.proofOfCompletionUrl && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <FileText className="w-3 h-3" />
                Proof attached
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

