'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, FileText, Download, Calendar, User, CheckCircle2 } from 'lucide-react';
import { getUserCalendars, getCalendarTodos } from '@/lib/firestore';
import { format } from 'date-fns';
import type { TodoItem } from '@/lib/types';

export default function CompletedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [completedTodos, setCompletedTodos] = useState<TodoItem[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadCompletedTodos();
    }
  }, [user]);

  const loadCompletedTodos = async () => {
    if (!user) return;

    try {
      setDataLoading(true);
      const calendars = await getUserCalendars(user.uid);
      
      if (calendars.length > 0) {
        const todos = await getCalendarTodos(calendars[0].id);
        const completed = todos.filter(todo => todo.completed);
        setCompletedTodos(completed);
      }
    } catch (error) {
      console.error('Error loading completed todos:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Completed Tasks</h1>
              <p className="text-sm text-gray-600">
                {completedTodos.length} {completedTodos.length === 1 ? 'task' : 'tasks'} completed
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List of Completed Todos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Completed Tasks</h2>
            
            {completedTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No completed tasks yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {completedTodos.map(todo => (
                  <div
                    key={todo.id}
                    onClick={() => setSelectedTodo(todo)}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedTodo?.id === todo.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800">{todo.title}</h3>
                        {todo.completedAt && (
                          <p className="text-sm text-gray-500 mt-1">
                            Completed {format(new Date(todo.completedAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                        {todo.proofOfCompletionUrl && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                            <FileText className="w-4 h-4" />
                            <span>Proof attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedTodo ? (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Task Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedTodo.title}
                    </h3>
                    {selectedTodo.description && (
                      <p className="text-gray-600">{selectedTodo.description}</p>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {selectedTodo.completedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium">
                          {format(new Date(selectedTodo.completedAt), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                    )}

                    {selectedTodo.assignedToEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium">{selectedTodo.assignedToEmail}</span>
                      </div>
                    )}
                  </div>

                  {selectedTodo.proofOfCompletionUrl && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Proof of Completion
                      </h4>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          {selectedTodo.proofOfCompletionName}
                        </p>
                        
                        {selectedTodo.proofOfCompletionUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="mb-3">
                            <img
                              src={selectedTodo.proofOfCompletionUrl}
                              alt="Proof of completion"
                              className="max-w-full h-auto rounded-lg border border-gray-200"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <FileText className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        
                        <a
                          href={selectedTodo.proofOfCompletionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download File
                        </a>
                      </div>
                    </div>
                  )}

                  {!selectedTodo.proofOfCompletionUrl && (
                    <div className="border-t pt-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          No proof of completion has been uploaded for this task.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a task to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

