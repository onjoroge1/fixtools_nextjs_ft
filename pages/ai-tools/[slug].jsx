import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const tools = {
  'remove-ai-tells-from-text': {
    title: 'Remove AI Tells From Text',
    description: 'Review text for common AI-writing patterns and produce a cleaner, more natural draft.',
    mode: 'humanizer',
  },
  'resume-for-data-scientist': {
    title: 'Resume for Data Scientist',
    description: 'Build a focused data scientist resume outline with impact-oriented bullets and the sections recruiters expect.',
    mode: 'resume',
  },
};

const replacements = [
  [/\bdelve into\b/gi, 'explore'],
  [/\bin today['’]s (?:fast-paced|digital) (?:world|landscape)\b/gi, 'today'],
  [/\bit is important to note that\b/gi, 'notably'],
  [/\butilize\b/gi, 'use'],
  [/\bleverage\b/gi, 'use'],
  [/\ba testament to\b/gi, 'evidence of'],
  [/\bseamlessly\b/gi, 'smoothly'],
  [/\brobust\b/gi, 'strong'],
];

function cleanText(value) {
  let output = value;
  replacements.forEach(([pattern, replacement]) => { output = output.replace(pattern, replacement); });
  output = output.replace(/\s{2,}/g, ' ').replace(/\n{3,}/g, '\n\n');
  return output.trim();
}

export default function LegacyAiTool({ tool, slug }) {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('Python, SQL, machine learning');
  const [impact, setImpact] = useState('');

  const output = useMemo(() => {
    if (tool.mode === 'humanizer') return cleanText(input);
    if (!name && !impact) return '';
    const skillList = skills.split(',').map((skill) => skill.trim()).filter(Boolean).join(' • ');
    return `${name || 'Your Name'}\nDATA SCIENTIST\n\nSUMMARY\nData scientist focused on turning complex data into measurable product and business outcomes.\n\nCORE SKILLS\n${skillList}\n\nEXPERIENCE HIGHLIGHT\n• ${impact || 'Describe an analysis or model, the technique you used, and the measurable result.'}\n• Built reproducible data workflows and communicated findings to technical and non-technical stakeholders.\n• Validated model performance with appropriate holdout, cross-validation, and monitoring methods.\n\nPROJECTS\n• Add 1–2 projects with dataset size, model or method, evaluation metric, and outcome.\n\nEDUCATION\n• Degree, school, graduation year, and relevant quantitative coursework.`;
  }, [tool.mode, input, name, skills, impact]);

  const canonical = `https://fixtools.io/ai-tools/${slug}`;
  return (
    <>
      <Head>
        <title>{tool.title} | FixTools</title>
        <meta name="description" content={tool.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
      </Head>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
          <nav className="mb-8 text-sm text-slate-600" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="mx-2">/</span><Link href="/aitools">AI tools</Link><span className="mx-2">/</span><span>{tool.title}</span>
          </nav>
          <header className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{tool.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{tool.description}</p>
          </header>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              {tool.mode === 'humanizer' ? (
                <>
                  <label htmlFor="source" className="font-semibold">Text to review</label>
                  <textarea id="source" value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder="Paste your draft here…" className="mt-3 w-full rounded-xl border border-slate-300 p-4" />
                  <p className="mt-3 text-sm leading-6 text-slate-500">This tool removes several common formulaic phrases and spacing artifacts. Always review the result for meaning and voice.</p>
                </>
              ) : (
                <div className="space-y-4">
                  <label className="block font-semibold">Name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" placeholder="Your name" /></label>
                  <label className="block font-semibold">Core skills<input value={skills} onChange={(e) => setSkills(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label>
                  <label className="block font-semibold">Strongest measurable achievement<textarea value={impact} onChange={(e) => setImpact(e.target.value)} rows={7} className="mt-2 w-full rounded-xl border border-slate-300 p-3" placeholder="Example: Reduced forecast error 18% by…" /></label>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">{tool.mode === 'humanizer' ? 'Cleaned draft' : 'Resume outline'}</h2>
              <pre className="mt-3 min-h-[300px] whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{output || 'Your result will appear here.'}</pre>
            </div>
          </section>

          <div className="mt-8"><Link href="/tools" className="font-semibold text-emerald-700">Browse all FixTools →</Link></div>
        </div>
      </main>
    </>
  );
}

export function getStaticPaths() {
  return { paths: Object.keys(tools).map((slug) => ({ params: { slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  const tool = tools[params.slug];
  if (!tool) return { notFound: true };
  return { props: { tool, slug: params.slug } };
}
