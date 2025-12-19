// src/pages/NoteDetailPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Note } from '../types';
import * as api from '../services/api';
import Input, { TextArea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Tag from '../components/ui/Tag';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { Save, ArrowLeft, Tag as TagIcon, Trash2, Share2 } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns'; // Ensure all are imported
import ShareNoteModal from '../components/notes/ShareNoteModal';


const NoteDetailPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<"personal" | "project">("personal");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const fetchNoteDetails = useCallback(async () => {
    if (!noteId) {
        navigate('/'); 
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNote = await api.getNoteById(noteId);
      setNote(fetchedNote);
      setTitle(fetchedNote.title);
      setContent(fetchedNote.content);
      setType(fetchedNote.type_);
      setTags(fetchedNote.tags || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load note details.');
      setNote(null); 
    } finally {
      setIsLoading(false);
    }
  }, [noteId, navigate]);

  useEffect(() => {
    fetchNoteDetails();
  }, [fetchNoteDetails]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note || !user) return;
    if (!title || !content) {
        setError("Title and content are required.");
        return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Ensure userId is correctly assigned. Backend's NoteBase needs userId.
      // If updating, this is likely the original note.userId or the current user._id
      // depending on your backend logic for ownership/editing.
      // For now, let's assume it's the original note's userId for consistency
      // if the note allows shared users to edit.
      // If only owner can edit, then this should be user._id and backend should verify.
      const noteOwnerId = note.userId || user._id; // Prioritize existing note's userId

      const updatedNoteData = {
        userId: noteOwnerId, 
        title,
        type_: type,
        content,
        tags,
      };
      const updatedNote = await api.updateNote(note._id, updatedNoteData);
      setNote(updatedNote); 
      setTitle(updatedNote.title);
      setContent(updatedNote.content);
      setType(updatedNote.type_);
      setTags(updatedNote.tags);
      setSuccess('Note updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update note.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteNote = async () => {
    if (!note || !confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;
    setIsSaving(true); // Use isSaving to disable buttons during delete
    try {
      await api.deleteNote(note._id);
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || 'Failed to delete note.');
      setIsSaving(false); // Reset isSaving on error
    }
  };
  
  const handleNoteShared = (updatedNote: Note) => {
    setNote(updatedNote); 
    setSuccess('Note sharing status updated.');
    setTimeout(() => setSuccess(null), 3000);
  };

  const getFormattedDetailTimestamp = (dateString: string | undefined | null): string => {
    if (!dateString) {
      return 'Date unavailable';
    }
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MMM d, yyyy 'at' h:mm a");
      } else {
        const fallbackDate = new Date(dateString);
        if (isValid(fallbackDate)) {
          return format(fallbackDate, "MMM d, yyyy 'at' h:mm a");
        }
        return 'Invalid date';
      }
    } catch (error) {
      return 'Error parsing date';
    }
  };


  if (isLoading) return <div className="container mx-auto p-8"><LoadingSpinner message="Loading note..." /></div>;
  if (error && !note) return <div className="container mx-auto p-8"><Alert type="error" message={error} /> <Link to="/"><Button variant="ghost">Back to Dashboard</Button></Link></div>;
  if (!note) return <div className="container mx-auto p-8 text-center"><p>Note not found.</p><Link to="/"><Button variant="ghost">Back to Dashboard</Button></Link></div>;

  // Determine if the current user can edit.
  // This could be the owner or a user it's shared with, depending on your app's rules.
  // For now, let's assume owner can edit. Shared users might have view-only or edit rights.
  // The backend will ultimately enforce edit permissions.
  const isOwner = user && note.userId === user._id;
  // A more complex `canEdit` logic might check `note.shared_with` and permissions.
  // For simplicity, let's assume only the owner can edit for now for form fields,
  // but share/delete buttons have their own logic.
  // We can refine this based on requirements.
  const canEditFields = isOwner; // Simple edit permission for form fields

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-textSecondary hover:text-textPrimary">
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-2">
            {isOwner && ( // Share button might be available to owner or shared users
                 <Button onClick={() => setIsShareModalOpen(true)} variant="secondary" size="sm" icon={<Share2 size={16} className="mr-1"/>} disabled={isSaving}>
                    Share
                </Button>
            )}
            {isOwner && ( // Only original owner can delete
                <Button onClick={handleDeleteNote} variant="danger" size="sm" icon={<Trash2 size={16} className="mr-1"/>} isLoading={isSaving} disabled={isSaving}>
                    Delete
                </Button>
            )}
        </div>

      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleUpdateNote} className="bg-bgCard p-6 sm:p-8 rounded-lg shadow-xl border border-slate-200 space-y-6">
        <div>
            <Input
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-semibold !py-3"
                disabled={!canEditFields || isSaving}
                required
            />
        </div>
        
        <div>
            <TextArea
                label="Content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                disabled={!canEditFields || isSaving}
                required
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="noteTypeDetail" className="block text-sm font-medium text-textSecondary mb-1">Note Type</label>
                <select
                id="noteTypeDetail"
                name="noteTypeDetail"
                value={type}
                onChange={(e) => setType(e.target.value as "personal" | "project")}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm rounded-md disabled:bg-slate-100"
                disabled={!canEditFields || isSaving}
                >
                <option value="personal">Personal</option>
                <option value="project">Project</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">Tags</label>
                {canEditFields ? (
                    <>
                        <div className="flex items-center gap-2">
                        <Input
                            name="tagInputDetail"
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add a tag"
                            className="flex-grow"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag();}}}
                            disabled={!canEditFields || isSaving}
                        />
                        <Button type="button" onClick={handleAddTag} variant="secondary" size="sm" className="px-3" disabled={!canEditFields || isSaving}>
                            <TagIcon size={16} className="mr-1" /> Add
                        </Button>
                        </div>
                    </>
                ) : null }
                <div className="mt-2 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <Tag key={tag} onRemove={canEditFields ? () => handleRemoveTag(tag) : undefined}>{tag}</Tag>
                ))}
                {tags.length === 0 && !canEditFields && <p className="text-sm text-slate-500">No tags.</p>}
                </div>
            </div>
        </div>
        
        <div className="text-xs text-slate-500 space-x-4">
            <span>Created: {getFormattedDetailTimestamp(note.created_at)}</span>
            <span>Last Updated: {getFormattedDetailTimestamp(note.updated_at)}</span>
        </div>

        {/* *********************************** */}
        {/*          ADD THIS SECTION           */}
        {/* *********************************** */}
        {canEditFields && (
            <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={isSaving} disabled={isSaving} icon={<Save size={18} className="mr-2"/>}>
                    Save Changes
                </Button>
            </div>
        )}
        {/* *********************************** */}

      </form>
      
      <ShareNoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        noteToShare={note}
        onNoteShared={handleNoteShared}
        // Pass isSaving to disable interaction if needed during other operations
      />
    </div>
  );
};

export default NoteDetailPage;