import React, { useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

import { Movie } from "../typings";
import MoviesLine from "./MoviesLine";

type Props = {
  movies?: Movie[];
  title?: string;
  isDetails: boolean;
  type: string;
  isSearch?: boolean;
  isfavourite?: boolean;
  likeMovies?: { id: string; data: () => Movie }[];
};

function Row({
  movies,
  title,
  isDetails,
  type,
  isSearch,
  isfavourite,
  likeMovies,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div
      className={
        isfavourite || isSearch
          ? `h-auto space-y-0.5 md:space-y-2 px-1`
          : `h-40 space-y-0.5 md:space-y-2 px-4`
      }
    >
      <h2
        className={
          isDetails
            ? `w-full cursor-pointer text-xl font-bold text-white text-shadow-soft transition-all duration-300 hover:text-red-400 hover:scale-105 md:text-3xl mb-4 flex items-center gap-3`
            : `w-full cursor-pointer text-lg font-bold text-white text-shadow-soft transition-all duration-300 hover:text-red-400 hover:scale-105 md:text-2xl mb-4 flex items-center gap-3`
        }
      >
        <span className="text-red-500 text-2xl">🎬</span>
        {title}
        <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
      </h2>
      <div className="group relative md:-ml-2">
        {!isSearch && (
          <div className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-12 w-12 flex items-center justify-center cursor-pointer opacity-0 transition-all duration-300 hover:scale-125 group-hover:opacity-100 bg-black/50 hover:bg-red-600/90 rounded-full backdrop-blur-sm border border-gray-700 hover:border-red-500 ${
              !isMoved && "hidden"
            }`}
            onClick={() => handleClick("left")}
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </div>
        )}

        {isfavourite ? (
          <div
            ref={rowRef}
            className={
              (likeMovies?.length || 0) >= 4
                ? `gap-x-10 grid overflow-x-hidden gap-y-6 sm:gap-x-14 lg:gap-x-14 md:gap-x-10`
                : `flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2`
            }
          >
            {likeMovies!.map((movie: { id: string; data: () => Movie }) => (
              <MoviesLine
                key={movie.id}
                movie={movie.data()}
                isDetails={isDetails}
                type={type}
                isfavourite={isfavourite}
              />
            ))}
          </div>
        ) : (
          <div
            ref={rowRef}
            className={
              isSearch && movies!.length >= 4
                ? `grid overflow-x-hidden gap-y-6 gap-x-24`
                : `flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2`
            }
          >
            {movies?.map((movie) => (
              <MoviesLine
                key={movie.id}
                movie={movie}
                isDetails={isDetails}
                type={type}
              />
            ))}
          </div>
        )}

        {!isSearch && (
          <div className="absolute top-0 bottom-0 right-2 z-40 m-auto h-12 w-12 flex items-center justify-center cursor-pointer opacity-0 transition-all duration-300 hover:scale-125 group-hover:opacity-100 bg-black/50 hover:bg-red-600/90 rounded-full backdrop-blur-sm border border-gray-700 hover:border-red-500"
            onClick={() => handleClick("right")}
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Row;
