'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { SubstackPost, SearchResult } from '@/types';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

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
  const [portalReady, setPortalReady] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      onResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Use AI-powered search via API
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results);
        onResults(data.results);
        setShowResults(true);
      } else {
        setResults([]);
        onResults([]);
        setShowResults(false);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return; // Ignore aborted requests
      console.error('Search error:', error);
      setResults([]);
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

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

  useEffect(() => {
    setPortalReady(true);
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
        <SearchIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-sm bg-white border rounded-lg border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {portalReady && showResults && (query || results.length > 0) && createPortal(
        <div className="absolute left-0 right-0 z-[100] mt-1 overflow-y-auto border rounded-lg shadow-lg top-full max-h-96 border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 dark:shadow-2xl" style={{ position: 'fixed', width: searchRef.current?.offsetWidth, top: (searchRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY, left: searchRef.current?.getBoundingClientRect().left ?? 0 }}>
          {isSearching ? (
            <div className="p-3 text-sm text-center text-slate-500 dark:text-slate-400">
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
                  }}
                />
              ))}
            </div>
          ) : query ? (
            <div className="p-3 text-sm text-center text-slate-500 dark:text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>,
        document.body
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
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        onClick();
      }}
      className="block p-3 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate text-slate-900 dark:text-slate-100">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-500">
            <span>{new Date(post.pubDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>Relevance: {Math.round((score / 4.5) * 100)}%</span>
          </div>
        </div>
      </div>
    </a>
  );
}
