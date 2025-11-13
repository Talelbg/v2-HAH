'use client';

import useSWR from 'swr';
import UpdatePostForm from './components/UpdatePostForm';

// The fetcher function is a simple wrapper around fetch
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data: posts, error, isLoading } = useSWR(
    '/api/posts', 
    fetcher,
    {
      // Poll for new data every 3 seconds
      refreshInterval: 3000, 
      // Automatically refetch when the browser tab is focused
      revalidateOnFocus: true, 
    }
  );

  if (error) return <div className="error-text">Failed to load posts. Please try again later.</div>;
  if (isLoading) return <div className="loading-text">Loading evaluations...</div>;

  return (
    <>
      <h1>Real-Time Evaluation Feed</h1>
      <div className="posts-container">
        {posts && posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <UpdatePostForm postId={post.id} initialContent={post.content} />
          </div>
        ))}
      </div>
    </>
  );
}
