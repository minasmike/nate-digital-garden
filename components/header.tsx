import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { Search } from './search';
import { SubstackPost, SearchResult } from '@/types';
import { BookOpen, Rss } from 'lucide-react';

interface HeaderProps {
  posts: SubstackPost[];
  onSearchResults: (results: SearchResult[]) => void;
}

export function Header({ posts, onSearchResults }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-700 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-slate-100">
            {/* <BookOpen className="h-6 w-6" /> */}
            <Image
              src="/nate 2.png"
              alt="Nate's Digital Garden Logo"
              width={32}
              height={32}
              className="hidden md:block"
            />
            <span>Nate's Digital Garden</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/archive"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              Archive
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Search posts={posts} onResults={onSearchResults} />

          <div className="flex items-center gap-2">
            <Link
              href={process.env.NEXT_PUBLIC_SUBSTACK_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
              aria-label="Visit Substack"
            >
              <Rss className="h-4 w-4" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
