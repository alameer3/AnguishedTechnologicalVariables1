import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PlayCircleIcon, InformationCircleIcon } from "./Icons";
import { motion } from "framer-motion";

import { firestore } from "../firebase/firebase";
import { Movie } from "../typings";
import { SessionType } from "../types/session";
import LoadingSpinner from "./LoadingSpinner";
import ImprovedSkeleton from "./ImprovedSkeleton";
import EnhancedButton from "./EnhancedButton";

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

  if (!movie) {
    return <ImprovedSkeleton type="banner" className="w-full" />;
  }

  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12 lg:pl-24 relative z-20">
      <div className="absolute top-0 left-0 h-[95vh] w-screen -z-10 relative">
        {(movie?.backdrop_path || movie?.poster_path) ? (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={`${baseUrl}${movie.backdrop_path || movie.poster_path}`}
              alt={movie?.title || movie?.name || movie?.original_name || "Movie poster"}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <LoadingSpinner size="large" text="جاري تحميل المحتوى..." />
          </div>
        )}
        <div className="absolute w-full h-32 bg-gradient-to-t from-black to-transparent bottom-0 z-20" />
      </div>

      <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl max-w-xs md:max-w-lg lg:max-w-2xl">
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl line-clamp-3 text-white">
        {movie?.overview}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button 
          onClick={handleChangePage}
          className="flex items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:bg-[#e6e6e6] md:py-2.5 md:px-8 md:text-xl"
        >
          <PlayCircleIcon className="h-4 w-4 text-black md:h-7 md:w-7" />
          تشغيل
        </button>
        
        <button 
          onClick={handleChangePage}
          className="flex items-center gap-x-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#6f6f6f] md:py-2.5 md:px-8 md:text-xl"
        >
          <InformationCircleIcon className="h-4 w-4 md:h-7 md:w-7" />
          المزيد من المعلومات
        </button>
      </div>
    </div>
  );
}

export default HomeBanner;
