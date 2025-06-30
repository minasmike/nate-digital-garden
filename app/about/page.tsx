'use client'
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <>
      <Header posts={[]} onSearchResults={() => {}} />
      <main className="container min-h-screen px-4 py-16 mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
          <h1 className="mb-8 text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 drop-shadow-lg">About Nate Jones</h1>
          <div className="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p className="text-xl font-semibold text-blue-900 dark:text-blue-200">Building the future, one AI experiment at a time</p>
            <p>I’m Nate—a writer, builder, and relentless tinkerer obsessed with how AI reshapes human potential.</p>
            <h2 className="mt-8 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">What I Do</h2>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Explain the AI revolution through Substack essays and keynotes.</li>
              <li>Build tools that turn AI hype into practical workflows (often live on TikTok).</li>
              <li>Help companies navigate the messy, exhilarating transition to an AI-native world.</li>
            </ul>
            <h2 className="mt-8 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">Why It Matters</h2>
            <p>Most AI discourse is either doomer panic or corporate fluff. I focus on the middle path:</p>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>How real people can wield AI to 10x their output.</li>
              <li>Why "human vs. machine" is the wrong framing.</li>
              <li>The skills that’ll actually matter in 2025 (hint: it’s not prompt engineering).</li>
            </ul>
            <h2 className="mt-8 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">My Backstory</h2>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Former [AI researcher/startup founder/whatever Nate’s actual background is].</li>
              <li>Wrote 500+ AI breakdowns since 2022 (archived here).</li>
              <li>Once [amusing anecdote: e.g., "trained a model to write poetry while backpacking"]</li>
            </ul>
            <h2 className="mt-8 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">This Digital Garden</h2>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Latest essays (auto-synced from Substack)</li>
              <li>Unfinished ideas (raw notes)</li>
              <li>Toolkit (AI workflows I actually use)</li>
            </ul>
            <h2 className="mt-8 mb-2 text-2xl font-bold text-blue-700 dark:text-blue-400">Let’s Build Together</h2>
            <ul className="space-y-2 list-disc list-inside pl-4">
              <li>Hiring? I consult for select clients.</li>
              <li>Want my brain on your podcast? Email me.</li>
              <li>Prefer 140-character wisdom? <a href="https://twitter.com/natebjones" className="text-blue-600 underline dark:text-blue-300" target="_blank" rel="noopener noreferrer">@natebjones</a>.</li>
            </ul>
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-200"><strong>Current obsession:</strong> What I’m building now →</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
