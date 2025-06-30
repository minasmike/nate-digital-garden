import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>© {currentYear} Nate&apos;s Digital Garden</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-500" /> and{' '}
              <Coffee className="w-3 h-3 text-amber-600" />
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Privacy
            </Link>
            <Link
              href="/rss"
              className="transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              RSS
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Source
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-center text-slate-500 dark:text-slate-500">
          <p>
            Automatically synced from{' '}
            <Link
              href={process.env.NEXT_PUBLIC_SUBSTACK_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700 dark:hover:text-slate-300"
            >
              Nate&apos;s Substack
            </Link>
            {' '}• Enhanced with AI-powered search
          </p>
        </div>
      </div>
    </footer>
  );
}
