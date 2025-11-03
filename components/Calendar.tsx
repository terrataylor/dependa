'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent } from '@/lib/types';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onSyncGoogleCalendar: () => void;
  syncingCalendar?: boolean;
  syncProgress?: number;
}

export default function Calendar({ events, onAddEvent, onEventClick, onSyncGoogleCalendar, syncingCalendar, syncProgress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.startDate), day));
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg p-4 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onSyncGoogleCalendar}
            disabled={syncingCalendar}
            className={`
              px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium
              ${syncingCalendar 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {syncingCalendar ? 'Syncing...' : 'Sync Calendar'}
          </button>
          <button
            onClick={onAddEvent}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Sync Progress Bar */}
      {syncingCalendar && (
        <div className="mb-4 flex-shrink-0">
          <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1 text-center">
            Syncing Google Calendar... {syncProgress}%
          </p>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 flex-shrink-0">
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 text-xs sm:text-sm py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days - with proper height constraints */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 auto-rows-fr overflow-auto">
          {daysInCalendar.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`
                  border rounded-lg p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] flex flex-col transition-colors overflow-hidden
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                  hover:bg-gray-50
                `}
              >
                <div className={`
                  text-xs sm:text-sm font-medium mb-1 flex-shrink-0
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'text-blue-600 font-bold' : ''}
                `}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 overflow-y-auto flex-1 min-h-0">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`
                        text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer truncate
                        ${event.color || 'bg-blue-100 text-blue-800'}
                        hover:opacity-80 transition-opacity
                      `}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

