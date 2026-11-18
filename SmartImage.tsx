import React, { useEffect, useState } from 'react';
import { PawPrint } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  aspectClass?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  aspectClass = '',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#E9F3ED] to-[#D4E6DC] text-[#115C39] p-4 text-center select-none ${aspectClass} ${className}`}
      >
        <PawPrint className="w-8 h-8 opacity-65 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-[#20322A]/75 max-w-[180px] leading-snug">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};
