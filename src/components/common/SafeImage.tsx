import React, { useState, useEffect } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder-photo.svg',
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  ...restProps
}) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'fallback' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);

  // Sync internal state if src prop changes
  useEffect(() => {
    if (!src || !src.trim()) {
      setImgStatus('fallback');
      setCurrentSrc(fallbackSrc);
    } else {
      setImgStatus('loading');
      setCurrentSrc(src);
    }
  }, [src, fallbackSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgStatus('loaded');
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgStatus === 'loading' && currentSrc !== fallbackSrc) {
      // Try fallback image
      setImgStatus('fallback');
      setCurrentSrc(fallbackSrc);
    } else {
      // Fallback also failed or initial src failed without valid fallback
      setImgStatus('error');
    }

    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden inline-block ${className}`}>
      {/* Loading Skeleton State */}
      {imgStatus === 'loading' && (
        <div
          data-testid="safe-image-skeleton"
          className="absolute inset-0 bg-[#EDE5D2]/70 dark:bg-[#24483C]/50 animate-pulse motion-reduce:animate-none flex flex-col items-center justify-center text-[#24483C] dark:text-[#F8F4EA] text-xs font-semibold p-2 z-10 rounded-inherit"
        >
          <span className="text-xl mb-1">📸</span>
          <span className="text-center truncate max-w-full px-2">Loading image...</span>
        </div>
      )}

      {/* Terminal Error Fallback Container (Prevents Broken Browser Image Icon) */}
      {imgStatus === 'error' ? (
        <div
          data-testid="safe-image-error-fallback"
          className="w-full h-full min-h-[120px] bg-[#315C4C] text-[#F8F4EA] flex flex-col items-center justify-center p-4 text-center rounded-inherit space-y-1.5"
          role="img"
          aria-label={alt || 'Image unavailable'}
        >
          <span className="text-3xl">🖼️</span>
          <p className="font-heading font-extrabold text-xs sm:text-sm line-clamp-2">
            {alt || 'Photo Memory'}
          </p>
          <span className="text-[10px] text-[#EDE5D2]/80 font-medium">
            Image Currently Unavailable
          </span>
        </div>
      ) : (
        /* Actual Image Element */
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imgStatus === 'loaded' || imgStatus === 'fallback' ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          {...restProps}
        />
      )}
    </div>
  );
};

export default SafeImage;
