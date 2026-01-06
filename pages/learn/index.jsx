import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function LearnIndex() {
  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/learn`;

  // Learning categories
  const categories = [
    {
      name: 'Development & Programming',
      slug: 'development',
      description: 'Learn programming languages, data formats, and web development technologies.',
      icon: '💻',
      color: 'emerald',
      gradient: 'from-emerald-600 via-green-600 to-emerald-600',
      borderColor: 'border-emerald-300',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700',
      badgeColor: 'emerald',
      lessons: [
        {
          title: 'JSON',
          description: 'Master JSON syntax, data types, objects, arrays, and best practices.',
          link: '/learn/json',
          icon: '📄',
          status: 'available',
          duration: '2 hours',
          lessons: 10,
          examples: 50
        },
        {
          title: 'HTML',
          description: 'Learn HTML5 fundamentals, semantic markup, forms, and modern web development.',
          link: '/learn/html',
          icon: '🌐',
          status: 'coming-soon',
          duration: '3 hours',
          lessons: 15,
          examples: 75
        },
        {
          title: 'CSS',
          description: 'Master CSS3, Flexbox, Grid, animations, and responsive design.',
          link: '/learn/css',
          icon: '🎨',
          status: 'coming-soon',
          duration: '4 hours',
          lessons: 20,
          examples: 100
        },
        {
          title: 'JavaScript',
          description: 'Learn JavaScript fundamentals, ES6+, DOM manipulation, and modern patterns.',
          link: '/learn/javascript',
          icon: '⚡',
          status: 'coming-soon',
          duration: '5 hours',
          lessons: 25,
          examples: 150
        },
        {
          title: 'XML',
          description: 'Understand XML syntax, XPath, XSLT, and data exchange formats.',
          link: '/learn/xml',
          icon: '📋',
          status: 'coming-soon',
          duration: '2 hours',
          lessons: 12,
          examples: 40
        },
        {
          title: 'YAML',
          description: 'Learn YAML syntax, configuration files, and data serialization.',
          link: '/learn/yaml',
          icon: '📝',
          status: 'coming-soon',
          duration: '1.5 hours',
          lessons: 8,
          examples: 30
        }
      ]
    },
    {
      name: 'Languages',
      slug: 'languages',
      description: 'Learn natural languages with interactive lessons, vocabulary, and grammar.',
      icon: '🌍',
      color: 'blue',
      gradient: 'from-blue-600 via-indigo-600 to-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      badgeColor: 'blue',
      lessons: [
        {
          title: 'Spanish',
          description: 'Learn Spanish vocabulary, grammar, pronunciation, and common phrases.',
          link: '/learn/spanish',
          icon: '🇪🇸',
          status: 'coming-soon',
          duration: '10 hours',
          lessons: 30,
          examples: 200
        },
        {
          title: 'French',
          description: 'Master French language basics, conversation, and cultural context.',
          link: '/learn/french',
          icon: '🇫🇷',
          status: 'coming-soon',
          duration: '10 hours',
          lessons: 30,
          examples: 200
        },
        {
          title: 'German',
          description: 'Learn German grammar, vocabulary, and practical communication skills.',
          link: '/learn/german',
          icon: '🇩🇪',
          status: 'coming-soon',
          duration: '10 hours',
          lessons: 30,
          examples: 200
        },
        {
          title: 'Italian',
          description: 'Discover Italian language fundamentals and cultural expressions.',
          link: '/learn/italian',
          icon: '🇮🇹',
          status: 'coming-soon',
          duration: '10 hours',
          lessons: 30,
          examples: 200
        },
        {
          title: 'Portuguese',
          description: 'Learn Portuguese vocabulary, grammar, and Brazilian/European variations.',
          link: '/learn/portuguese',
          icon: '🇵🇹',
          status: 'coming-soon',
          duration: '10 hours',
          lessons: 30,
          examples: 200
        },
        {
          title: 'Japanese',
          description: 'Master Japanese hiragana, katakana, kanji, and essential phrases.',
          link: '/learn/japanese',
          icon: '🇯🇵',
          status: 'coming-soon',
          duration: '15 hours',
          lessons: 40,
          examples: 300
        }
      ]
    },
    {
      name: 'Data Formats & APIs',
      slug: 'data-formats',
      description: 'Understand data formats, APIs, and data exchange standards.',
      icon: '📊',
      color: 'purple',
      gradient: 'from-purple-600 via-pink-600 to-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      badgeColor: 'purple',
      lessons: [
        {
          title: 'REST APIs',
          description: 'Learn REST API design, HTTP methods, status codes, and best practices.',
          link: '/learn/rest-apis',
          icon: '🔌',
          status: 'coming-soon',
          duration: '3 hours',
          lessons: 15,
          examples: 60
        },
        {
          title: 'GraphQL',
          description: 'Master GraphQL queries, mutations, schemas, and API design.',
          link: '/learn/graphql',
          icon: '🔷',
          status: 'coming-soon',
          duration: '3 hours',
          lessons: 15,
          examples: 50
        },
        {
          title: 'CSV Format',
          description: 'Understand CSV structure, parsing, and data manipulation.',
          link: '/learn/csv',
          icon: '📈',
          status: 'coming-soon',
          duration: '1 hour',
          lessons: 6,
          examples: 20
        }
      ]
    }
  ];

  // Count available vs coming soon
  const totalLessons = categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
  const availableLessons = categories.reduce((sum, cat) => 
    sum + cat.lessons.filter(l => l.status === 'available').length, 0
  );

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Learn - Free Interactive Tutorials & Courses | FixTools</title>
        <meta name="title" content="Learn - Free Interactive Tutorials & Courses | FixTools" />
        <meta name="description" content="Free interactive tutorials and courses. Learn programming (JSON, HTML, CSS, JavaScript), languages (Spanish, French, German), and data formats. Interactive examples, try-it-yourself editors, and instant feedback." />
        <meta name="keywords" content="learn programming, learn json, learn html, learn css, learn spanish, free tutorials, interactive courses, coding tutorials, language learning" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Learn - Free Interactive Tutorials & Courses" />
        <meta property="og:description" content="Free interactive tutorials for programming, languages, and data formats. Learn by doing with live examples." />
        <meta property="og:image" content={`${siteHost}/images/learn-og.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Learn - Free Interactive Tutorials & Courses" />
        <meta property="twitter:description" content="Free interactive tutorials for programming, languages, and data formats." />
        <meta property="twitter:image" content={`${siteHost}/images/learn-og.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Learn - Free Interactive Tutorials",
          "description": "Free interactive tutorials and courses for programming, languages, and data formats",
          "url": canonicalUrl,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": categories.flatMap((cat, catIndex) => 
              cat.lessons.map((lesson, lessonIndex) => ({
                "@type": "ListItem",
                "position": catIndex * 100 + lessonIndex + 1,
                "name": lesson.title,
                "url": `${siteHost}${lesson.link}`
              }))
            )
          }
        })}} />
      </Head>

      <style jsx global>{`
        html:has(.learn-index-page) {
          font-size: 100% !important;
        }
        
        .learn-index-page {
          line-height: 1.5;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>

      <div className="learn-index-page bg-[#fbfbfc] text-slate-900 min-h-screen">
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
              <Link className="font-semibold text-emerald-600" href="/learn">Learn</Link>
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
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Learn</span></li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free • Interactive • Self-Paced
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Learn by Doing
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Free interactive tutorials and courses. Master programming languages, data formats, natural languages, and more. Learn with live examples, try-it-yourself editors, and instant feedback.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Courses</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{totalLessons}+</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available Now</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">{availableLessons}</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Interactive</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">100%</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.slug} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
                {/* Category Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                      <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.lessons.map((lesson) => (
                    <Link
                      key={lesson.link}
                      href={lesson.status === 'available' ? lesson.link : '#'}
                      className={`group rounded-2xl border-2 p-6 transition-all duration-300 flex flex-col ${
                        lesson.status === 'available'
                          ? `${category.borderColor} bg-white hover:shadow-lg hover:-translate-y-1 cursor-pointer`
                          : 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center mb-4">
                        <span className="text-4xl mb-3">{lesson.icon}</span>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                          {lesson.status === 'available' && (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-${category.badgeColor}-100 text-${category.badgeColor}-700`}>
                              Available
                            </span>
                          )}
                          {lesson.status === 'coming-soon' && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{lesson.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mb-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{lesson.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📚</span>
                          <span>{lesson.lessons} lessons</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💡</span>
                          <span>{lesson.examples}+ examples</span>
                        </span>
                      </div>
                      
                      {lesson.status === 'available' && (
                        <div className={`mt-auto pt-4 border-t border-slate-200 flex items-center justify-center`}>
                          <span className={`text-sm font-semibold text-${category.textColor} group-hover:underline`}>
                            Start Learning →
                          </span>
                        </div>
                      )}
                      {lesson.status === 'coming-soon' && (
                        <div className="mt-auto pt-4 border-t border-slate-200 text-center">
                          <span className="text-sm text-slate-500">Coming soon</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '64px 64px' }}></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-emerald-50 mb-6 max-w-2xl mx-auto leading-relaxed">
                Choose a course above and start learning with interactive examples, instant feedback, and hands-on practice.
              </p>
              <Link 
                href="/learn/json"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-emerald-600 shadow-lg transition-all duration-200 hover:bg-emerald-50 hover:scale-[1.02] hover:shadow-xl"
              >
                <span>📚 Start with JSON Tutorial</span>
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

