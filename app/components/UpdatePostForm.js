
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
        throw new Error('Failed to save changes.');
      }

      // Tell all SWR hooks with this key to revalidate (refetch)
      mutate('/api/posts');
      
      setStatusMessage('Saved successfully!');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error saving.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(''), 2000); // Clear message after 2s
    }
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1rem',
  };

  const textareaStyles = {
    width: '100%',
    minHeight: '80px',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  };
  
  const buttonContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const buttonStyles = {
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s',
  };

  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  }

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <textarea
        style={textareaStyles}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your evaluation notes..."
        aria-label="Evaluation Content"
      />
      <div style={buttonContainerStyles}>
        <button type="submit" style={isSubmitting ? disabledButtonStyles : buttonStyles} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Evaluation'}
        </button>
        {statusMessage && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{statusMessage}</span>}
      </div>
    </form>
  );
}
