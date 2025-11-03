'use client';

import React from 'react';
import { X, Calendar, Clock, FileText, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/lib/types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDelete?: (eventId: string) => void;
}

export default function EventDetailsModal({ isOpen, onClose, event, onDelete }: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex-1 pr-4">
            {event.title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
                {event.allDay ? (
                  <p className="text-gray-900">
                    {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                    {new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && (
                      <span> - {format(new Date(event.endDate), 'EEEE, MMMM d, yyyy')}</span>
                    )}
                  </p>
                ) : (
                  <>
                    <p className="text-gray-900">
                      {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                    {new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && (
                      <p className="text-gray-900">
                        to {format(new Date(event.endDate), 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {!event.allDay && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                  <p className="text-gray-900">
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </p>
                </div>
              </div>
            )}

            {event.allDay && (
              <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 rounded px-3 py-1.5 w-fit">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">All-day event</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Google Calendar Badge */}
          {event.googleEventId && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <ExternalLink className="w-4 h-4" />
                <span>Synced from Google Calendar</span>
              </div>
            </div>
          )}

          {/* Event Metadata */}
          <div className="border-t pt-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Event ID: {event.id}</p>
              {event.googleEventId && (
                <p>Google Event ID: {event.googleEventId.substring(0, 20)}...</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


