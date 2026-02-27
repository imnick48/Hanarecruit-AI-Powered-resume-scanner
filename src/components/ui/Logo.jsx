import React from 'react';

export default function Logo({ size = 'md' }) {
  const iconSize = size === 'lg' ? 'w-12 h-12 rounded-2xl' : 'w-9 h-9 rounded-xl';
  const svgSize = size === 'lg' ? 22 : 18;
  const textSize = size === 'lg' ? 'text-4xl' : 'text-xl';

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${iconSize} flex items-center justify-center`}
        style={{ background: '#4f46e5' }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <span
        className={`${textSize} font-bold tracking-tight`}
        style={{ color: '#1e1b4b' }}
      >
        RecruitRank
      </span>
    </div>
  );
}
