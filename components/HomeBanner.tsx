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
    <div className="flex flex-col space-y-4 py-20 md:space-y-6 lg:h-[70vh] lg:justify-end lg:pb-16 lg:pl-28">
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
        <div className="absolute w-full h-40 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent bottom-0 z-20" />
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-3xl md:text-5xl lg:text-8xl font-black text-white text-shadow-enhanced"
      >
        {movie?.title || movie?.name || movie?.original_name}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="max-w-sm text-base md:max-w-xl md:text-xl lg:max-w-3xl lg:text-2xl line-clamp-4 text-white font-medium text-shadow-enhanced leading-relaxed"
      >
        {movie?.overview}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8"
      >
        <EnhancedButton
          variant="primary"
          size="lg"
          onClick={handleChangePage}
          icon={<PlayCircleIcon className="h-6 w-6 md:h-8 md:w-8" />}
        >
          ▶ تشغيل الآن
        </EnhancedButton>
        
        <EnhancedButton
          variant="outline"
          size="lg"
          onClick={handleChangePage}
          icon={<InformationCircleIcon className="h-6 w-6 md:h-8 md:w-8" />}
        >
          ℹ المزيد من التفاصيل
        </EnhancedButton>
      </motion.div>
    </div>
  );
}

export default HomeBanner;
