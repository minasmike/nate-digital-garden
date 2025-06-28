import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>© {currentYear} Nate's Digital Garden</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500" /> and{' '}
              <Coffee className="h-3 w-3 text-amber-600" />
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/privacy"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/rss"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              RSS
            </Link>
            <Link 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Source
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          <p>
            Automatically synced from{' '}
            <Link 
              href={process.env.NEXT_PUBLIC_SUBSTACK_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700 dark:hover:text-slate-300"
            >
              Nate's Substack
            </Link>
            {' '}• Enhanced with AI-powered search
          </p>
        </div>
      </div>
    </footer>
  );
}
