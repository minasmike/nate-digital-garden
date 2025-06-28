'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { SubstackPost, SearchResult } from '@/types';
import { cn } from '@/lib/utils';

interface SearchProps {
  posts: SubstackPost[];
  onResults: (results: SearchResult[]) => void;
  placeholder?: string;
}

export function Search({ posts, onResults, placeholder = "Search Nate's writings..." }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      onResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use simple text search for now (can be enhanced with AI later)
      const searchResults = posts
        .map(post => {
          const queryLower = searchQuery.toLowerCase();
          const titleMatch = post.title.toLowerCase().includes(queryLower);
          const contentMatch = post.content.toLowerCase().includes(queryLower);
          const excerptMatch = post.excerpt.toLowerCase().includes(queryLower);
          
          let score = 0;
          if (titleMatch) score += 2;
          if (excerptMatch) score += 1.5;
          if (contentMatch) score += 1;
          
          return { post, score, relevantSections: [] };
        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setResults(searchResults);
      onResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [posts, onResults]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    onResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {isSearching ? (
            <div className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-1">
              {results.map((result, index) => (
                <SearchResultItem
                  key={result.post.id}
                  result={result}
                  onClick={() => {
                    setShowResults(false);
                    // Navigate to post (this would be handled by parent component)
                  }}
                />
              ))}
            </div>
          ) : query ? (
            <div className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const { post, score } = result;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <span>{new Date(post.pubDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>Relevance: {Math.round(score * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
