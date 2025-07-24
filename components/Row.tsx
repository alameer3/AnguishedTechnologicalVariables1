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
          ? `h-auto space-y-0.5 md:space-y-2 px-4 md:px-12`
          : `h-40 space-y-0.5 md:space-y-2 px-4 md:px-12`
      }
    >
      <h2 className="netflix-title text-xl font-bold mb-4 md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        {!isSearch && (
          <ChevronLeftIcon
            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition-opacity hover:scale-125 group-hover:opacity-100 ${
              !isMoved && "hidden"
            }`}
            onClick={() => handleClick("left")}
          />
        )}

        {isfavourite ? (
          <div
            ref={rowRef}
            className={
              (likeMovies?.length || 0) >= 4
                ? `gap-x-10 grid overflow-x-hidden gap-y-6 sm:gap-x-14 lg:gap-x-14 md:gap-x-10`
                : `flex items-center scrollbar-netflix space-x-1 overflow-x-scroll md:space-x-2 md:p-2`
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
                : `flex items-center scrollbar-netflix space-x-1 overflow-x-scroll md:space-x-2 md:p-2`
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
          <ChevronRightIcon
            className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition-opacity hover:scale-125 group-hover:opacity-100"
            onClick={() => handleClick("right")}
          />
        )}
      </div>
    </div>
  );
}

export default Row;
