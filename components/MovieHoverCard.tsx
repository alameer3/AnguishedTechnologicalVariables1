import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Movie } from '../typings';
import { PlayCircleIcon, PlusIcon, HandThumbUpIcon, InformationCircleIcon } from './Icons';

interface MovieHoverCardProps {
  movie: Movie;
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const MovieHoverCard: React.FC<MovieHoverCardProps> = ({
  movie,
  isVisible,
  onClose,
  position
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-700 w-80 overflow-hidden"
          style={{
            left: Math.min(position.x, window.innerWidth - 320 - 20),
            top: Math.min(position.y, window.innerHeight - 400 - 20),
          }}
          onMouseLeave={onClose}
        >
          {/* صورة الفيلم */}
          <div className="relative h-44 bg-gradient-to-br from-zinc-800 to-zinc-900">
            {movie.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.title || movie.name || ""}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                sizes="320px"
              />
            )}
            
            {/* تدرج في الأسفل */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            
            {/* أزرار التحكم */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <PlayCircleIcon className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-800/80 text-white rounded-full p-2 border-2 border-zinc-600 hover:border-white transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-800/80 text-white rounded-full p-2 border-2 border-zinc-600 hover:border-white transition-colors"
              >
                <HandThumbUpIcon className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* زر المعلومات */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 bg-zinc-800/80 text-white rounded-full p-2 border-2 border-zinc-600 hover:border-white transition-colors"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* معلومات الفيلم */}
          <div className="p-4 space-y-3">
            <h3 className="text-white font-bold text-lg leading-tight">
              {movie.title || movie.name || movie.original_name}
            </h3>
            
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-300">
              {movie.vote_average && (
                <span className="text-green-400 font-semibold">
                  {Math.round(movie.vote_average * 10)}% مطابق
                </span>
              )}
              
              {(movie.release_date || movie.first_air_date) && (
                <span>
                  {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                </span>
              )}
            </div>
            
            {movie.overview && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {movie.overview}
              </p>
            )}
            
            {/* الأنواع */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genre_ids.slice(0, 3).map((genreId) => (
                  <span
                    key={genreId}
                    className="text-xs bg-zinc-700 text-gray-300 px-2 py-1 rounded"
                  >
                    النوع {genreId}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieHoverCard;