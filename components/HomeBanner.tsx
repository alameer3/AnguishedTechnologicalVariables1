import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PlayCircleIcon, InformationCircleIcon } from "./Icons";

import { firestore } from "../firebase/firebase";
import { Movie } from "../typings";
import { SessionType } from "../types/session";

const baseUrl = "https://image.tmdb.org/t/p/original";

type Props = {
  netflixOriginals: Movie[];
  session?: SessionType;
  isTv?: boolean;
};

function HomeBanner({ netflixOriginals, session, isTv }: Props) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userCreates, setUserCreate] = useState<boolean>(false);

  const getUserData = async () => {
    if (session && session.user?.uid) {
      try {
        const docRef = doc(firestore, "netflixUsers", session.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserCreate(false);
        } else {
          setUserCreate(true);
        }
      } catch (error) {
        // Firebase permission error is expected with mock session - skip silently
        setUserCreate(false);
      }
    }
  };

  const userCreate = async (session: SessionType) => {
    if (session?.user?.uid) {
      try {
        const userDocRef = doc(firestore, "netflixUsers", session.user.uid);
        await setDoc(userDocRef, JSON.parse(JSON.stringify(session)));
      } catch (error) {
        // Firebase permission error is expected with mock session - skip silently
      }
    }
  };

  useEffect(() => {
    getUserData();

    if (userCreates && session) {
      userCreate(session);
    }
  }, [session, firestore, userCreates]);

  useEffect(() => {
    setMovie(
      netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
    );
  }, [netflixOriginals]);

  const handleChangePage = () => {
    if (movie?.id) {
      router.push({
        pathname: `details/${movie.id}`,
        query: {
          movieId: movie.id.toString(),
          type: isTv ? "tv" : "movie",
        },
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12 lg:pl-24">
      <div className="absolute top-0 left-0 h-[95vh] w-screen -z-10">
        {(movie?.backdrop_path || movie?.poster_path) ? (
          <Image
            src={`${baseUrl}${movie.backdrop_path || movie.poster_path}`}
            alt={movie?.title || movie?.name || movie?.original_name || "Movie poster"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        )}
        <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      </div>

      <h1 className="text-2xl md:text-4xl lg:text-7xl font-bold">
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl line-clamp-5">
        {movie?.overview}
      </p>

      <div className="flex space-x-3">
        <button
          className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black"
          onClick={handleChangePage}
        >
          <PlayCircleIcon className="h-4 w-4 text-black md:h-7 md:w-7" />
          Play
        </button>
        <button
          className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-[gray]/70"
          onClick={handleChangePage}
        >
          More Info{" "}
          <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" />
        </button>
      </div>
    </div>
  );
}

export default HomeBanner;
