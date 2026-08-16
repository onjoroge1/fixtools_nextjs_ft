import Head from 'next/head';
import Link from 'next/link';

const topics = {
  ruby: {
    name: 'Ruby',
    eyebrow: 'Programming language',
    description: 'Learn Ruby fundamentals including variables, collections, methods, blocks, classes, and practical scripting patterns.',
    keywords: 'learn ruby, ruby tutorial, ruby basics, ruby programming, ruby examples',
    intro: 'Ruby is a readable, object-oriented programming language designed to make code expressive and productive.',
    sections: [
      ['Start with the basics', 'Learn variables, strings, numbers, arrays, hashes, conditionals, and loops with short examples you can adapt immediately.'],
      ['Methods and blocks', 'Understand reusable methods, blocks, iterators, and Ruby’s concise enumerable patterns such as map, select, and each.'],
      ['Objects and classes', 'Move from scripts to structured programs with classes, modules, inheritance, and composition.'],
    ],
    example: "names = ['Ada', 'Grace', 'Matz']\nputs names.map { |name| name.upcase }",
  },
  swift: {
    name: 'Swift',
    eyebrow: 'Programming language',
    description: 'Learn Swift fundamentals including optionals, collections, functions, structs, classes, protocols, and modern iOS-ready syntax.',
    keywords: 'learn swift, swift tutorial, swift basics, ios programming, swift examples',
    intro: 'Swift is Apple’s modern programming language for building apps across iPhone, iPad, Mac, Apple Watch, and other Apple platforms.',
    sections: [
      ['Core syntax', 'Learn constants and variables, strings, arrays, dictionaries, control flow, and Swift’s type system.'],
      ['Optionals and safety', 'Understand optional values, safe unwrapping, guard statements, and the language features that prevent common runtime errors.'],
      ['Structs and protocols', 'Build reusable models using value types, extensions, protocols, and protocol-oriented design.'],
    ],
    example: "let names = [\"Ada\", \"Grace\", \"Linus\"]\nlet upper = names.map { $0.uppercased() }\nprint(upper)",
  },
  french: {
    name: 'French',
    eyebrow: 'Language learning',
    description: 'Learn practical French vocabulary, pronunciation, greetings, sentence patterns, and everyday conversational phrases.',
    keywords: 'learn french, french basics, french phrases, french vocabulary, beginner french',
    intro: 'Build useful French from the phrases and sentence patterns you are most likely to use in real conversations.',
    sections: [
      ['Greetings', 'Start with bonjour, salut, au revoir, s’il vous plaît, merci, and the most common polite expressions.'],
      ['Useful sentence patterns', 'Practice introducing yourself, asking simple questions, ordering food, requesting directions, and talking about time.'],
      ['Vocabulary that compounds', 'Prioritize high-frequency verbs, nouns, adjectives, numbers, days, and travel vocabulary before rare words.'],
    ],
    example: 'Bonjour ! Je m’appelle Alex.\nComment allez-vous ?\nJe voudrais un café, s’il vous plaît.\nMerci beaucoup !',
  },
  italian: {
    name: 'Italian',
    eyebrow: 'Language learning',
    description: 'Learn practical Italian vocabulary, pronunciation, greetings, sentence patterns, and everyday conversational phrases.',
    keywords: 'learn italian, italian basics, italian phrases, italian vocabulary, beginner italian',
    intro: 'Build practical Italian through common phrases, repeatable sentence patterns, and high-frequency vocabulary.',
    sections: [
      ['Greetings', 'Start with buongiorno, ciao, arrivederci, per favore, grazie, and everyday polite expressions.'],
      ['Useful sentence patterns', 'Practice introducing yourself, asking questions, ordering food, requesting directions, and handling common travel situations.'],
      ['Vocabulary that compounds', 'Learn high-frequency verbs, nouns, adjectives, numbers, days, and conversational connectors first.'],
    ],
    example: 'Buongiorno! Mi chiamo Alex.\nCome stai?\nVorrei un caffè, per favore.\nGrazie mille!',
  },
};

export default function LearnTopic({ topic }) {
  const canonical = `https://fixtools.io/learn/${topic.slug}`;
  return (
    <>
      <Head>
        <title>Learn {topic.name} – Free Beginner Guide | FixTools</title>
        <meta name="description" content={topic.description} />
        <meta name="keywords" content={topic.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
      </Head>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
          <nav className="mb-8 text-sm text-slate-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/learn" className="hover:text-slate-900">Learn</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-900">{topic.name}</span>
          </nav>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{topic.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Learn {topic.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{topic.intro}</p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {topic.sections.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Quick example</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100"><code>{topic.example}</code></pre>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn" className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Explore more lessons</Link>
            <Link href="/tools" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50">Browse FixTools</Link>
          </div>
        </div>
      </main>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.keys(topics).map((topic) => ({ params: { topic } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const data = topics[params.topic];
  if (!data) return { notFound: true };
  return { props: { topic: { ...data, slug: params.topic } } };
}
