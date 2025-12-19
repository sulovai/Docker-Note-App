// src/pages/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Note } from '../types';
import * as api from '../services/api';
import CreateNoteForm from '../components/notes/CreateNoteForm';
import NotesList from '../components/notes/NotesList';
import ShareNoteModal from '../components/notes/ShareNoteModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Search, Filter, X } from 'lucide-react';
import Tag from '../components/ui/Tag';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [personalNotes, setPersonalNotes] = useState<Note[]>([]);
  const [projectNotes, setProjectNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [tagFilteredNotes, setTagFilteredNotes] = useState<Note[] | null>(null);
  const [searchedNotes, setSearchedNotes] = useState<Note[] | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [personal, projects, shared] = await Promise.all([
        api.getPersonalNotes(user._id),
        api.getProjectNotes(user._id),
        api.getSharedNotes(user._id),
      ]);
      setPersonalNotes(personal);
      setProjectNotes(projects);
      setSharedNotes(shared);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteCreated = (newNote: Note) => {
    fetchNotes(); // Re-fetch all notes to ensure lists are up-to-date
    setShowCreateNote(false); // Close form after creation
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.deleteNote(noteId);
      fetchNotes(); // Re-fetch
    } catch (err: any) {
      setError(err.message || 'Failed to delete note.');
    }
  };

  const handleOpenShareModal = (note: Note) => {
    setNoteToShare(note);
    setIsShareModalOpen(true);
  };

  const handleNoteShared = (updatedNote: Note) => {
    // Update the specific note in the local state or re-fetch
    setPersonalNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
    setProjectNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
    setSharedNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
    // No need to close modal here, ShareNoteModal handles its state
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !searchTerm.trim()) {
        setSearchedNotes(null); // Clear search results if query is empty
        return;
    }
    setIsLoading(true);
    try {
        const results = await api.searchNotes(user._id, searchTerm);
        setSearchedNotes(results);
        setTagFilteredNotes(null); // Clear tag filter when searching
    } catch (err:any) {
        setError(err.message || 'Failed to search notes.');
        setSearchedNotes([]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleTagFilter = async () => {
    if (!user || activeTagFilters.length === 0) {
        setTagFilteredNotes(null); // Clear filter if no tags
        return;
    }
    setIsLoading(true);
    try {
        const results = await api.getNotesByTags(user._id, activeTagFilters);
        setTagFilteredNotes(results);
        setSearchedNotes(null); // Clear search results when filtering by tag
    } catch (err: any) {
        setError(err.message || 'Failed to filter notes by tags.');
        setTagFilteredNotes([]);
    } finally {
        setIsLoading(false);
    }
  };

  const addTagToFilter = () => {
    if (tagSearchTerm.trim() && !activeTagFilters.includes(tagSearchTerm.trim())) {
        const newFilters = [...activeTagFilters, tagSearchTerm.trim()];
        setActiveTagFilters(newFilters);
        setTagSearchTerm('');
        // Trigger filter
        if(user) {
          api.getNotesByTags(user._id, newFilters).then(setTagFilteredNotes).catch(err => setError(err.message));
          setSearchedNotes(null);
        }
    }
  };

  const removeTagFromFilter = (tagToRemove: string) => {
    const newFilters = activeTagFilters.filter(tag => tag !== tagToRemove);
    setActiveTagFilters(newFilters);
    if (user) {
      if (newFilters.length > 0) {
        api.getNotesByTags(user._id, newFilters).then(setTagFilteredNotes).catch(err => setError(err.message));
      } else {
        setTagFilteredNotes(null); // Clear filter if no tags left
      }
      setSearchedNotes(null);
    }
  };

  const clearFiltersAndSearch = () => {
    setSearchTerm('');
    setSearchedNotes(null);
    setTagSearchTerm('');
    setActiveTagFilters([]);
    setTagFilteredNotes(null);
    setError(null);
    fetchNotes(); // Optionally re-fetch all notes
  };


  if (isLoading && !personalNotes.length && !projectNotes.length && !sharedNotes.length && !searchedNotes && !tagFilteredNotes) {
    return <div className="container mx-auto p-4"><LoadingSpinner message="Loading your notes..." /></div>;
  }

  const displayNotes = searchedNotes ? searchedNotes : (tagFilteredNotes ? tagFilteredNotes : null);
  const isFilteredOrSearched = searchedNotes !== null || tagFilteredNotes !== null;


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">My Notes Dashboard</h1>
        <Button onClick={() => setShowCreateNote(!showCreateNote)} variant="primary">
          {showCreateNote ? 'Cancel' : 'Create New Note'}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      {showCreateNote && (
        <div className="mb-8">
          <CreateNoteForm onNoteCreated={handleNoteCreated} />
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-8 p-6 bg-bgCard shadow-md rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Search */}
          <div>
            <label htmlFor="search-notes" className="block text-sm font-medium text-textSecondary mb-1">Search Notes (Title/Content)</label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                id="search-notes"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term..."
                className="flex-grow"
              />
              <Button type="submit" variant="primary" size="sm">
                <Search size={18} className="mr-1" />
                Search
              </Button>
            </form>
          </div>

          {/* Tag Filter */}
          <div>
            <label htmlFor="tag-filter" className="block text-sm font-medium text-textSecondary mb-1">Filter by Tags</label>
            <div className="flex gap-2">
              <Input
                id="tag-filter"
                type="text"
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                placeholder="Enter tag to filter..."
                className="flex-grow"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTagToFilter();}}}
              />
              <Button type="button" onClick={addTagToFilter} variant="primary" size="sm">
                <Filter size={18} className="mr-1" />
                Add+
              </Button>
            </div>
            {activeTagFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-textSecondary">Active filters:</span>
                {activeTagFilters.map(tag => (
                  <Tag key={tag} onRemove={() => removeTagFromFilter(tag)}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>
        {(isFilteredOrSearched) && (
          <div className="mt-4 text-right">
            <Button onClick={clearFiltersAndSearch} variant="ghost" size="sm" className="text-accent-DEFAULT hover:text-accent-hover">
              <X size={16} className="mr-1" /> Clear Filters/Search
            </Button>
          </div>
        )}
      </div>


      {isLoading && <LoadingSpinner message="Processing..."/>}

      {displayNotes !== null && (
        <NotesList
            title={searchedNotes ? `Search Results for "${searchTerm}"` : `Notes Tagged With: ${activeTagFilters.join(', ')}`}
            notes={displayNotes}
            onDeleteNote={handleDeleteNote}
            onShareNote={handleOpenShareModal}
            isLoading={isLoading}
            emptyMessage="No notes match your criteria."
        />
      )}


      {!isFilteredOrSearched && (
        <>
          <NotesList
            title="My Personal Notes"
            notes={personalNotes}
            onDeleteNote={handleDeleteNote}
            onShareNote={handleOpenShareModal}
            isLoading={isLoading && personalNotes.length === 0}
            emptyMessage="You have no personal notes yet."
          />
          <NotesList
            title="My Project Notes"
            notes={projectNotes}
            onDeleteNote={handleDeleteNote}
            onShareNote={handleOpenShareModal}
            isLoading={isLoading && projectNotes.length === 0}
            emptyMessage="You have no project notes yet."
          />
          <NotesList
            title="Notes Shared With Me"
            notes={sharedNotes}
            onDeleteNote={handleDeleteNote} // Or disable delete for shared notes
            onShareNote={handleOpenShareModal} // Or disable share for shared notes
            isLoading={isLoading && sharedNotes.length === 0}
            emptyMessage="No notes have been shared with you."
          />
        </>
      )}


      <ShareNoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        noteToShare={noteToShare}
        onNoteShared={handleNoteShared}
      />
    </div>
  );
};

export default DashboardPage;