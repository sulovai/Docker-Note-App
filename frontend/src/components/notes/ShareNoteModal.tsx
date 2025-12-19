// src/components/notes/ShareNoteModal.tsx
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { shareNote as apiShareNote } from '../../services/api';
import type { Note } from '../../types';

interface ShareNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToShare: Note | null;
  onNoteShared: (updatedNote: Note) => void;
}

const ShareNoteModal: React.FC<ShareNoteModalProps> = ({ isOpen, onClose, noteToShare, onNoteShared }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteToShare || !email) {
      setError("Email is required.");
      return;
    }
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const updatedNote = await apiShareNote(noteToShare._id, email);
      onNoteShared(updatedNote);
      setSuccess(`Note shared successfully with ${email}.`);
      setEmail(''); // Optionally close modal or keep open for more shares
      // onClose(); // Uncomment to close modal on success
    } catch (err: any) {
      setError(err.message || "Failed to share note.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!noteToShare) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share Note: "${noteToShare.title}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
        <Input
            
          label="User's Email to Share With"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email address"
          required
        />
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Share</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ShareNoteModal;