import Link from 'next/link';
import { SubstackPost } from '@/types';
import { formatDate, getReadingTime, stripHtml } from '@/lib/utils';
import { ExternalLink, Calendar, Clock } from 'lucide-react';

interface PostCardProps {
  post: SubstackPost;
  showExcerpt?: boolean;
  className?: string;
}

export function PostCard({ post, showExcerpt = true, className = '' }: PostCardProps) {
  const readingTime = getReadingTime(stripHtml(post.content));
  const formattedDate = formatDate(post.pubDate);

  return (
    <article className={`group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={post.link} target="_blank" rel="noopener noreferrer" className="block">
              {post.title}
              <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </h2>
          
          {showExcerpt && (
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.isoDate}>{formattedDate}</time>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-1">
                <span>by {post.author}</span>
              </div>
            )}
          </div>
          
          {post.categories && post.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {category}
                </span>
              ))}
              {post.categories.length > 3 && (
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  +{post.categories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
