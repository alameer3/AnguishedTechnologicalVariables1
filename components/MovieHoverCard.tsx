import React, { useState } from 'react';
import Image from 'next/image';
import { Movie } from '../typings';
import {
  PlayIcon,
  PlusIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
} from '../components/Icons';

interface MovieHoverCardProps {
  movie: Movie;
  isVisible: boolean;
  position: { x: number; y: number };
}

const MovieHoverCard: React.FC<MovieHoverCardProps> = ({ movie, isVisible, position }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}س ${mins}د`;
  };

  const getGenreNames = (genreIds: number[]) => {
    const genreMap: { [key: number]: string } = {
      28: 'أكشن',
      12: 'مغامرة',
      16: 'رسوم متحركة',
      35: 'كوميديا',
      80: 'جريمة',
      99: 'وثائقي',
      18: 'دراما',
      10751: 'عائلي',
      14: 'خيال',
      36: 'تاريخي',
      27: 'رعب',
      10402: 'موسيقى',
      9648: 'غموض',
      10749: 'رومانسي',
      878: 'خيال علمي',
      10770: 'فيلم تلفزيوني',
      53: 'إثارة',
      10752: 'حرب',
      37: 'غرب',
    };

    return genreIds.slice(0, 3).map(id => genreMap[id] || 'غير محدد');
  };

  return (
    <div 
      className={`movie-hover-card ${isVisible ? 'show' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* صورة الفيلم */}
      <div className="relative w-full h-36 mb-3 rounded overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name || "Movie image"}
          fill
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* أزرار التحكم */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <PlayIcon className="w-4 h-4 text-black ml-0.5" />
          </button>
          <button className="w-8 h-8 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
          <button className="w-8 h-8 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <HandThumbUpIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* معلومات الفيلم */}
      <div className="space-y-2">
        <h3 className="text-white font-bold text-sm line-clamp-1">
          {movie.title || movie.name}
        </h3>

        {/* تفاصيل إضافية */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="text-green-400 font-semibold">
            {Math.round((movie.vote_average || 0) * 10)}% مطابق
          </span>
          <span className="border border-gray-600 px-1 text-gray-400">
            +13
          </span>
          <span>1س 45د</span>
        </div>

        {/* الأنواع */}
        <div className="flex flex-wrap gap-1">
          {getGenreNames(movie.genre_ids || []).map((genre, index) => (
            <span key={index} className="text-xs text-gray-400">
              {genre}
              {index < 2 && ' • '}
            </span>
          ))}
        </div>

        {/* نظرة عامة */}
        {movie.overview && (
          <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>
        )}

        {/* زر المزيد من المعلومات */}
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mt-3">
          <InformationCircleIcon className="w-4 h-4" />
          <span>المزيد من المعلومات</span>
        </button>
      </div>
    </div>
  );
};

export default MovieHoverCard;