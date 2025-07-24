import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Movie } from "../typings";
import { motion } from "framer-motion";

type Props = {
  movie: Movie;
  isDetails: Boolean;
  type: string;
  isfavourite?: boolean;
};

function MoviesLine({ movie, isDetails, type, isfavourite }: Props) {
  const router = useRouter();

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      whileHover={{ 
        scale: 1.08,
        y: -8,
        transition: { duration: 0.3 }
      }}
      onClick={handleChangePage}
      className={
        isDetails
          ? `relative h-28 min-w-[180px] cursor-pointer transition-all duration-300 ease-out md:h-[200px] md:min-w-[350px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/20 ring-1 ring-gray-800 hover:ring-red-500/50`
          : `relative h-28 min-w-[180px] cursor-pointer transition-all duration-300 ease-out md:h-36 md:min-w-[260px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/20 ring-1 ring-gray-800 hover:ring-red-500/50`
      }
    >
      {movie.backdrop_path || movie.poster_path ? (
        <div className="relative w-full h-full">
          <Image
            src={`https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`}
            fill
            className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
            alt={movie.title || movie.name || movie.original_name || "Movie poster"}
            sizes="(max-width: 768px) 180px, 260px"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAhEAABBQEBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgv/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3QAA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300 line-clamp-2">
            {movie.title || movie.name || movie.original_name}
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
        >
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
            <svg
              className="w-12 h-12 text-gray-200"
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
  );
}

export default MoviesLine;
