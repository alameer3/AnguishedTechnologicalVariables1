import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Movie } from "../typings";
import { motion } from "framer-motion";
import MovieHoverCard from "./MovieHoverCard";

type Props = {
  movie: Movie;
  isDetails: Boolean;
  type: string;
  isfavourite?: boolean;
};

function MoviesLine({ movie, isDetails, type, isfavourite }: Props) {
  const router = useRouter();
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangePage = () => {
    const detailsPath = `/details/${movie.id}`;
    
    if (isfavourite) {
      router.push({
        pathname: isDetails ? detailsPath : `details/${movie.id}`,
        query: {
          movieId: movie.id.toString(),
          type: movie?.title ? "movie" : "tv",
        },
      });
    } else {
      router.push({
        pathname: isDetails ? detailsPath : `details/${movie.id}`,
        query: {
          movieId: movie.id.toString(),
          type: movie.media_type?.toString()
            ? movie.media_type?.toString()
            : type.toString(),
        },
      });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverPosition({
          x: rect.left,
          y: rect.bottom + 10
        });
        setShowHoverCard(true);
      }
    }, 500); // تأخير 500ms قبل إظهار البطاقة
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowHoverCard(false);
  };

  return (
    <div className="relative">
      <motion.div
      onClick={handleChangePage}
      className="movie-card netflix-card-enhanced relative h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[240px] group"
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* تأثير التوهج عند الهوفر */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-500/20 via-transparent to-red-600/10 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
      
      {movie.backdrop_path || movie.poster_path ? (
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Image
            src={`https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            alt={movie.title || movie.name || movie.original_name || "Movie poster"}
            sizes="(max-width: 768px) 180px, 240px"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckriInlVOhgknyJhI"
          />
          
          {/* تدرج لوني من الأسفل */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          
          {/* عنوان الفيلم */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-xs md:text-sm font-semibold truncate text-shadow-soft">
              {movie.title || movie.name || movie.original_name}
            </h3>
            {movie.vote_average > 0 && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-white text-xs ml-1">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800 netflix-shimmer">
          <div className="flex items-center justify-center w-full h-full">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
        </div>
      )}
      </motion.div>

      {/* بطاقة المعاينة عند الهوفر */}
      <MovieHoverCard
        movie={movie}
        isVisible={showHoverCard}
        onClose={() => setShowHoverCard(false)}
        position={hoverPosition}
      />
    </div>
  );
}

export default MoviesLine;
