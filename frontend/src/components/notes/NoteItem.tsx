// src/components/notes/NoteItem.tsx
import React from 'react';
import type { Note } from '../../types';
import Tag from '../ui/Tag';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'; // Import parseISO and isValid
import { Edit3, Trash2, Share2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NoteItemProps {
  note: Note;
  onDelete: (noteId: string) => void;
  onShare: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onShare }) => {
  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getFormattedUpdateDate = () => {
    if (!note.updated_at) {
      // console.warn(`NoteItem: updated_at is missing or null for note ID: ${note._id}`);
      return 'Date unavailable'; // Or some other fallback string
    }
    try {
      // Prefer parseISO for better ISO 8601 compatibility
      const date = parseISO(note.updated_at);
      if (isValid(date)) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        // Fallback for other potential date string formats if parseISO fails
        const fallbackDate = new Date(note.updated_at);
        if (isValid(fallbackDate)) {
          // console.warn(`NoteItem: Used new Date() fallback for updated_at for note ID: ${note._id}, value: ${note.updated_at}`);
          return formatDistanceToNow(fallbackDate, { addSuffix: true });
        }
        // console.error(`NoteItem: Invalid updated_at date for note ID: ${note._id}, value: ${note.updated_at}`);
        return 'Invalid date';
      }
    } catch (error) {
      // console.error(`NoteItem: Error parsing updated_at for note ID: ${note._id}, value: ${note.updated_at}`, error);
      return 'Error parsing date';
    }
  };

  return (
    <div className="bg-bgCard p-5 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-textPrimary break-all">{note.title}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            note.type_ === 'personal' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {note.type_}
          </span>
        </div>
        <p className="text-sm text-textSecondary mb-3 break-words h-16 overflow-hidden">
          {truncateContent(note.content, 100)}
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {/* Add a check for note.tags existing before trying to map/slice */}
          {note.tags && note.tags.slice(0, 3).map(tag => <Tag key={tag}>{tag}</Tag>)}
          {note.tags && note.tags.length > 3 && <Tag>+{note.tags.length - 3} more</Tag>}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-3">
          Updated {getFormattedUpdateDate()}
        </p>
        <div className="flex items-center justify-end space-x-2">
          <Link to={`/note/${note._id}`}>
            <button title="View/Edit" className="p-1.5 text-textSecondary hover:text-primary-DEFAULT hover:bg-slate-100 rounded-md">
              <Eye size={18} />
            </button>
          </Link>
          <button title="Share" onClick={() => onShare(note)} className="p-1.5 text-textSecondary hover:text-accent-DEFAULT hover:bg-slate-100 rounded-md">
            <Share2 size={18} />
          </button>
          <button title="Delete" onClick={() => onDelete(note._id)} className="p-1.5 text-textSecondary hover:text-red-500 hover:bg-slate-100 rounded-md">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;