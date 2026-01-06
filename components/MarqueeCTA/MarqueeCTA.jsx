import React from 'react';
import Link from 'next/link';

/**
 * MarqueeCTA - Reusable animated marquee CTA component
 * 
 * @param {Object} props
 * @param {string} props.href - Link destination (default: '/learn')
 * @param {string} props.title - CTA title (default: 'Learn More')
 * @param {string} props.description - CTA description
 * @param {string} props.buttonText - Button text (default: 'Start Learning')
 * @param {string} props.emoji - Emoji icon (default: '📚')
 * @param {string} props.gradientFrom - Gradient start color (default: 'emerald')
 * @param {string} props.gradientTo - Gradient end color (default: 'green')
 */
export default function MarqueeCTA({
  href = '/learn',
  title = 'Learn More',
  description = 'Explore our interactive tutorials and guides',
  buttonText = 'Start Learning',
  emoji = '📚',
  gradientFrom = 'emerald',
  gradientTo = 'green',
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div 
        className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-12"
        style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: `url(/grid.png)`, 
              backgroundSize: '256px 256px',
              animation: 'marqueeScroll 20s linear infinite'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Emoji icon with pulse animation */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-500/30 animate-pulse">
              <span className="text-4xl">{emoji}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {title}
          </h2>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            {description}
          </p>

          {/* CTA Button */}
          <Link
            href={href}
            className={`group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-${gradientFrom}-600 to-${gradientTo}-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-${gradientFrom}-500/30 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-${gradientFrom}-500/40`}
          >
            <span>{buttonText}</span>
            <svg 
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Decorative elements */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Interactive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Beginner Friendly</span>
            </div>
          </div>
        </div>

        {/* Animated border gradient */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(16, 185, 129, 0.3), 
              transparent
            )`,
            animation: 'borderFlow 3s linear infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(256px);
          }
        }

        @keyframes borderFlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}


