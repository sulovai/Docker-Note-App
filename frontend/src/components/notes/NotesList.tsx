// src/components/notes/NotesList.tsx
import React from 'react';
import type { Note } from '../../types';
import NoteItem from './NoteItem';
import { FileText } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  title: string;
  onDeleteNote: (noteId: string) => void;
  onShareNote: (note: Note) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const NotesList: React.FC<NotesListProps> = ({ notes, title, onDeleteNote, onShareNote, isLoading, emptyMessage = "No notes found." }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-bgCard p-5 rounded-lg shadow-md border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-end space-x-2">
              <div className="h-7 w-7 bg-slate-200 rounded"></div>
              <div className="h-7 w-7 bg-slate-200 rounded"></div>
              <div className="h-7 w-7 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText size={48} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-xl font-medium text-textSecondary">{emptyMessage}</h3>
        <p className="text-sm text-slate-500">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-textPrimary mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <NoteItem key={note._id} note={note} onDelete={onDeleteNote} onShare={onShareNote} />
        ))}
      </div>
    </div>
  );
};

export default NotesList;