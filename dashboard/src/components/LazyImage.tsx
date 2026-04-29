// Lazy Image Component for optimized image loading
// Uses Intersection Observer API for lazy loading

import { memo, useState, useRef, useEffect } from 'react';
import { useLazyImage } from '@/hooks/use-optimization';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  threshold?: number;
  placeholder?: React.ReactNode;
  className?: string;
}

function LazyImageInner({
  src,
  alt,
  threshold = 0.1,
  placeholder = null,
  className = '',
  ...props
}: LazyImageProps) {
  const { imgRef, isLoaded, isInView } = useLazyImage(src, threshold);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (!isInView && placeholder) {
    return <>{placeholder}</>;
  }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800 ${className}`}
        {...props}
      >
        <span className="text-slate-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}

export const LazyImage = memo(LazyImageInner);
