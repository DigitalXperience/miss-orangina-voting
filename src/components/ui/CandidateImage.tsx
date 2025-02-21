import React from 'react';

interface CandidateImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CandidateImage: React.FC<CandidateImageProps> = ({ src, alt, className = '' }) => {
  return (
    <div className={`relative aspect-[3/4] ${className}`} style={{backgroundColor: '#1f2937'}}>
      {/* Image avec fallback */}
      <img
        src={src || 'https://placehold.co/300x400'}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          // En cas d'erreur, on remplace par une image de placeholder
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/300x400';
          console.log('Image fallback chargé pour:', alt);
        }}
      />
    </div>
  );
};

export default CandidateImage;