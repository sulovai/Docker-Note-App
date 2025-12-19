// src/components/notes/CreateNoteForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createPersonalNote } from '../../services/api'; // Assuming createProjectNote is similar or combined
import type { Note } from '../../types';
import Input, { TextArea } from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Tag from '../ui/Tag';
import { PlusCircle, Tag as TagIcon } from 'lucide-react';

interface CreateNoteFormProps {
  onNoteCreated: (newNote: Note) => void;
  initialType?: "personal" | "project";
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({ onNoteCreated, initialType = "personal" }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<"personal" | "project">(initialType);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create a note.");
      return;
    }
    if (!title || !content) {
        setError("Title and content are required.");
        return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Backend expects userId, title, type_, content, tags
      const noteData = {
        userId: user._id,
        title,
        type_: type,
        content,
        tags,
      };
      // For now, only using createPersonalNote. You might need a createProjectNote or a unified endpoint.
      const { note: newNote } = await createPersonalNote(noteData);
      onNoteCreated(newNote);
      setTitle('');
      setContent('');
      setTags([]);
      setCurrentTag('');
      // Optionally reset type if it's selectable in form
    } catch (err: any) {
      setError(err.message || 'Failed to create note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-bgCard shadow-lg rounded-lg space-y-6 border border-slate-200">
      <h3 className="text-xl font-semibold text-textPrimary">Create New Note</h3>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter note title"
        required
      />
      <TextArea
        label="Content"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Write your note here..."
        required
      />
      
      <div>
        <label htmlFor="noteType" className="block text-sm font-medium text-textSecondary mb-1">Note Type</label>
        <select
          id="noteType"
          name="noteType"
          value={type}
          onChange={(e) => setType(e.target.value as "personal" | "project")}
          className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm rounded-md"
        >
          <option value="personal">Personal</option>
          <option value="project">Project</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-textSecondary mb-1">Tags</label>
        <div className="flex items-center gap-2">
          <Input
            name="tagInput"
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add a tag (e.g., work, urgent)"
            className="flex-grow"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag();}}}
          />
          <Button type="button" onClick={handleAddTag} variant="secondary" size="sm" className="px-3">
            <TagIcon size={16} className="mr-1" /> Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>{tag}</Tag>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        <PlusCircle size={18} className="mr-2" />
        Create Note
      </Button>
    </form>
  );
};

export default CreateNoteForm;