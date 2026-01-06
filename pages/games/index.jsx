import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function GamesIndex() {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/games`;

  // Game categories
  const gameCategories = [
    {
      title: 'Word Games',
      description: 'Play word games, puzzles, and brain teasers. Improve vocabulary and have fun.',
      link: '/games/word-games',
      icon: '🔤',
      color: 'blue',
      gradient: 'from-blue-600 via-indigo-600 to-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      gameCount: 5,
      games: ['Word Search', 'Crossword Generator', 'Anagram Solver', 'Word Scramble', 'Hangman']
    },
    {
      title: 'Number Games',
      description: 'Math games, puzzles, and number challenges. Practice math skills while having fun.',
      link: '/games/number-games',
      icon: '🔢',
      color: 'emerald',
      gradient: 'from-emerald-600 via-green-600 to-emerald-600',
      borderColor: 'border-emerald-300',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      gameCount: 4,
      games: ['Number Guessing', 'Math Quiz', 'Sudoku', 'Calculator Challenge']
    },
    {
      title: 'Puzzle Games',
      description: 'Brain teasers, logic puzzles, and mind-bending challenges. Test your problem-solving skills.',
      link: '/games/puzzle-games',
      icon: '🧩',
      color: 'purple',
      gradient: 'from-purple-600 via-pink-600 to-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      gameCount: 6,
      games: ['Memory Game', 'Pattern Matching', 'Logic Puzzle', 'Maze Generator', 'Tic Tac Toe', 'Connect Four']
    }
  ];

  const totalGames = gameCategories.reduce((sum, cat) => sum + cat.gameCount, 0);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Free Online Games - Word, Number & Puzzle Games | FixTools</title>
        <meta name="title" content="Free Online Games - Word, Number & Puzzle Games | FixTools" />
        <meta name="description" content="Free online games and puzzles. Play word games, number games, and puzzle games. All games work 100% in your browser - no downloads, no sign-ups, just fun." />
        <meta name="keywords" content="free online games, word games, puzzle games, number games, brain teasers, online games, browser games" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Free Online Games - Word, Number & Puzzle Games" />
        <meta property="og:description" content="Free online games and puzzles. Play word games, number games, and puzzle games." />
        <meta property="og:image" content={`${siteHost}/images/games-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Free Online Games - Word, Number & Puzzle Games" />
        <meta property="twitter:description" content="Free online games and puzzles." />
        <meta property="twitter:image" content={`${siteHost}/images/games-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Free Online Games",
          "description": "Free online games and puzzles",
          "url": canonicalUrl,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": gameCategories.map((cat, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": cat.title,
              "url": `${siteHost}${cat.link}`
            }))
          }
        })}} />
      </Head>

      <style jsx global>{`
        html:has(.games-index-page) {
          font-size: 100% !important;
        }
        
        .games-index-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="games-index-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex" aria-label="Main navigation" role="navigation">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/css">CSS</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/image-tools">Images</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/learn">Learn</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/back-to-school">Back to School</Link>
              <Link className="font-semibold text-purple-600" href="/games">Games</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              Browse tools
            </Link>
          </div>
        </header>

        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb" role="navigation">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Games</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Free • Fun • No Downloads
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Free Online Games
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Play word games, number games, and puzzle games. All games work 100% in your browser - no downloads, no sign-ups, just fun.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Game Categories</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{gameCategories.length}</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Games</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{totalGames}+</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Downloads</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">None</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Game Categories Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="space-y-12">
            {gameCategories.map((category) => (
              <div key={category.link} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
                {/* Category Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
                      <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.games.map((game, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <div className="flex flex-col items-center text-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{game}</h3>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600">
                          Coming Soon
                        </span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-200 text-center">
                        <span className="text-sm text-slate-500">Coming soon</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl border-2 border-purple-300 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '64px 64px' }}></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Games Coming Soon!
              </h2>
              <p className="text-lg text-purple-50 mb-6 max-w-2xl mx-auto leading-relaxed">
                We're building fun, interactive games for you. Check back soon for word games, puzzles, and brain teasers.
              </p>
              <Link 
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-purple-600 shadow-lg transition-all duration-200 hover:bg-purple-50 hover:scale-[1.02] hover:shadow-xl"
              >
                <span>🔧 Browse Tools Instead</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© {currentYear} FixTools. All rights reserved. | <Link href="/privacy" className="hover:text-slate-900">Privacy</Link> | <Link href="/terms" className="hover:text-slate-900">Terms</Link></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

