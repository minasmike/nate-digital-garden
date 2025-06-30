import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { Search } from './search';
import { SearchResult } from '@/types';
import { Rss } from 'lucide-react';

interface HeaderProps {
  onSearchResults: (results: SearchResult[]) => void;
}

export function Header({ onSearchResults }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-700 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            {/* <BookOpen className="w-6 h-6" /> */}
            <Image
              src="/nate 2.png"
              alt="Nate's Digital Garden Logo"
              width={32}
              height={32}
              className="hidden md:block"
            />
            <span>Nate&apos;s Digital Garden</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Links, Mentorship, About - ordered and spaced */}
          <a
            href="https://linktr.ee/natebjones"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100 md:inline-block"
            style={{ marginRight: '1.25rem' }}
          >
            Links
          </a>
          <a
            href="https://product-templates.notion.site/How-I-accelerate-careers-5c922ee9270243fea8759fa4118e6b41"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-pink-700 transition-colors hover:text-pink-900 dark:text-pink-300 dark:hover:text-pink-100 md:inline-block"
            style={{ marginRight: '1.25rem' }}
          >
            Mentorship
          </a>
          <Link
            href="/about"
            className="hidden text-sm font-medium transition-colors text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:inline-block"
            style={{ marginRight: '2rem' }}
          >
            About
          </Link>
          <div style={{ width: '1.5rem' }} />
          <Search onResults={onSearchResults} />

          <div className="flex items-center gap-2">
            <Link
              href={process.env.NEXT_PUBLIC_SUBSTACK_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 transition-colors bg-white border rounded-md border-slate-200 text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
              aria-label="Visit Substack"
            >
              <Rss className="w-4 h-4" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
