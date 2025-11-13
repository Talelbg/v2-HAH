'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';

export default function UpdatePostForm({ postId, initialContent }) {
  const { mutate } = useSWRConfig();
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Saving...');

    try {
      const res = await fetch('/api/update-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save changes.');
      }

      // Tell all SWR hooks with this key to revalidate (refetch)
      await mutate('/api/posts');
      
      setStatusMessage('Saved successfully!');
    } catch (error) {
      console.error(error);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(''), 3000); // Clear message after 3s
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <textarea
        className="update-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your evaluation notes..."
        aria-label="Evaluation Content"
        rows={4}
      />
      <div className="update-controls">
        <button type="submit" className="update-button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Evaluation'}
        </button>
        {statusMessage && <span className="status-message">{statusMessage}</span>}
      </div>
    </form>
  );
}
