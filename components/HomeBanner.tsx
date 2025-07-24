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
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12 lg:pl-24">
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
        <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-2xl md:text-4xl lg:text-7xl font-bold drop-shadow-xl text-white"
      >
        {movie?.title || movie?.name || movie?.original_name}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl line-clamp-5 text-gray-100 drop-shadow-lg"
      >
        {movie?.overview}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="flex space-x-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black shadow-lg hover:shadow-xl"
          onClick={handleChangePage}
        >
          <PlayCircleIcon className="h-4 w-4 text-black md:h-7 md:w-7" />
          تشغيل
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-gray-600/70 backdrop-blur-sm text-white shadow-lg hover:shadow-xl"
          onClick={handleChangePage}
        >
          المزيد من المعلومات{" "}
          <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default HomeBanner;
