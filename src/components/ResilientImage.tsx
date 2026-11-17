import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  imgClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle = 'SPECIMEN',
  className = '',
  imgClassName = 'w-full h-full object-cover',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`relative overflow-hidden bg-[#16161B] text-[#F4F1EA] flex flex-col justify-between p-6 border border-[#F4F1EA]/12 ${className}`}
      >
        <div className="flex items-center justify-between font-mono-tabular text-[11px] opacity-60">
          <span>VISUAL PLATE</span>
          <span>RAW FRAME</span>
        </div>
        <div className="my-auto py-8">
          <svg
            viewBox="0 0 120 40"
            className="w-24 h-8 text-[#E63B1F] mb-4"
            aria-hidden="true"
          >
            <line x1="0" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="20" r="6" fill="currentColor" />
            <rect x="76" y="12" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="1.5" />
          </svg>
          <p className="font-display text-lg tracking-tight uppercase">{fallbackTitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={imgClassName}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
