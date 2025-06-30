import Link from 'next/link';
import { SubstackPost } from '@/types';
import { formatDate, getReadingTime, stripHtml } from '@/lib/utils';
import { ExternalLink, Calendar, Clock } from 'lucide-react';
import { decode } from 'he';
import Image from 'next/image';

interface PostCardProps {
  post: SubstackPost;
  showExcerpt?: boolean;
  className?: string;
  onPreview?: (post: SubstackPost) => void;
  onSummarize?: (post: SubstackPost) => void;
}

export function PostCard({ post, showExcerpt = true, className = '', onPreview, onSummarize }: PostCardProps) {
  const readingTime = getReadingTime(stripHtml(post.content));
  const formattedDate = formatDate(post.pubDate);

  return (
    <article className={`group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <Link href={post.link} target="_blank" rel="noopener noreferrer" className="block">
              {decode(post.title)}
              <ExternalLink className="inline-block w-4 h-4 ml-2 transition-opacity opacity-0 group-hover:opacity-100" />
            </Link>
          </h2>

          {showExcerpt && (
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {decode(post.excerpt)}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.isoDate}>{formattedDate}</time>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>

            {post.author && (
              <div className="flex items-center gap-1">
                <span>by {post.author}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              className="px-4 py-1.5 text-sm font-semibold rounded shadow-sm bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-150 hover:scale-105 hover:shadow-lg dark:border dark:border-green-300 dark:shadow-green-900 mr-2"
              onClick={() => onSummarize && onSummarize(post)}
              type="button"
            >
              <span className="inline-block mr-1 align-middle">📝</span> Auto-Summarize
            </button>
            <button
              className="px-4 py-1.5 text-sm font-semibold rounded shadow-sm bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-150 hover:scale-105 hover:shadow-lg dark:border dark:border-blue-300 dark:shadow-blue-900"
              onClick={() => onPreview && onPreview(post)}
              type="button"
            >
              <span className="inline-block mr-1 align-middle">🔍</span> Preview
            </button>

            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                  >
                    {category}
                  </span>
                ))}
                {post.categories.length > 3 && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    +{post.categories.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {post.image && (
          <div className="flex-shrink-0 hidden w-32 h-32 ml-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700 sm:block">
            {/\.(mp4|webm|ogg)$/i.test(post.image) ? (
              <video
                src={post.image}
                controls
                className="object-cover w-full h-full"
                preload="none"
              />
            ) : (
              <Image
                src={post.image}
                alt={decode(post.title)}
                className="object-cover w-full h-full"
                loading="lazy"
                width={128}
                height={128}
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
