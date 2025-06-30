"use client"
import { Header } from '@/components/header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header posts={[]} onSearchResults={() => {}} />
      <main className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-slate-900 dark:text-slate-100">404 – Not Found</h1>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">Sorry, the page you are looking for does not exist.</p>
          <Link href="/" className="inline-block px-8 py-4 text-lg font-bold text-white transition-all duration-200 rounded-full shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 dark:bg-gradient-to-r dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900 dark:text-blue-100 dark:shadow-grey dark:border dark:border-white ">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
              Go Home
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
