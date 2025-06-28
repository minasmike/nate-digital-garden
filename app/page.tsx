'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PostCard } from '@/components/post-card';
import { SubstackPost, SearchResult } from '@/types';
import { Sparkles, BookOpen, Search as SearchIcon } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SubstackPost[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length > 0);

    if (results.length > 0) {
      setFilteredPosts(results.map(r => r.post));
    } else {
      setFilteredPosts(posts);
    }
  };

  const displayPosts = isSearchActive ? searchResults.map(r => r.post) : posts.slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      <Header posts={posts} onSearchResults={handleSearchResults} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 md:text-6xl">
                  Nate's Digital Garden
                </h1>
              </div>

              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                An AI-enhanced collection of thoughts, ideas, and insights.
                Automatically synced from Substack with semantic search to help you discover
                connected ideas across all writings.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{posts.length} posts archived</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <SearchIcon className="w-4 h-4" />
                  <span>AI-powered semantic search</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-updated from Substack</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              <div className="grid gap-6 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-6 bg-white border rounded-lg animate-pulse border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                    <div className="h-6 mb-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
                      Error Loading Posts
                    </h3>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    No Posts Yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Posts will appear here once they're synced from Substack.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {isSearchActive ? `Search Results (${searchResults.length})` : 'Latest Posts'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {isSearchActive
                      ? 'Posts matching your search query'
                      : 'Recent thoughts and insights from the garden'
                    }
                  </p>
                </div>

                <div className="grid gap-6 md:gap-8">
                  {displayPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {!isSearchActive && posts.length > 10 && (
                  <div className="mt-12 text-center">
                    <button className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                      <BookOpen className="w-4 h-4" />
                      View All Posts ({posts.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
