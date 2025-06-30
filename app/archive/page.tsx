'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SubstackPost } from '@/types';
import { decode } from 'he';
import { formatDate } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ArchivePage() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <>
      <Header posts={posts} onSearchResults={() => {}} />
      <div className="container min-h-screen px-4 py-16 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-slate-900 dark:text-slate-100">Recent Posts</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center">No posts found.</div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {posts.map(post => (
              <Link key={post.id} href={post.link || '#'} target="_blank" rel="noopener noreferrer">
                <div className="p-6 transition bg-white border rounded-lg shadow cursor-pointer hover:shadow-lg dark:bg-slate-800 dark:border-slate-700">
                  <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{decode(post.title)}</h2>
                  <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">{formatDate(post.pubDate)}</div>
                  <p className="text-slate-700 dark:text-slate-300">{decode(post.excerpt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
