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
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12 lg:pl-24 relative z-20 page-transition">
      {/* تدرجات متطورة متعددة الطبقات مثل Netflix */}
      <div className="absolute inset-0 gradient-overlay-advanced z-10" />
      <div className="absolute inset-0 gradient-overlay-bottom z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10" />
      <div className="absolute top-0 left-0 h-[95vh] w-screen -z-10 relative overflow-hidden">
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

      <h1 
        className="title-enhanced responsive-title font-bold max-w-xs md:max-w-lg lg:max-w-2xl relative z-20"
        data-text={movie?.title || movie?.name || movie?.original_name}
      >
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="description-enhanced responsive-body max-w-xs md:max-w-lg lg:max-w-2xl line-clamp-3 relative z-20">
        {movie?.overview}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-20">
        <button 
          onClick={handleChangePage}
          className="netflix-btn-primary px-6 py-3 text-sm md:py-4 md:px-8 md:text-lg"
        >
          <PlayCircleIcon className="h-4 w-4 text-black md:h-6 md:w-6" />
          تشغيل
        </button>
        
        <button 
          onClick={handleChangePage}
          className="netflix-btn-secondary px-6 py-3 text-sm md:py-4 md:px-8 md:text-lg"
        >
          <InformationCircleIcon className="h-4 w-4 md:h-6 md:w-6" />
          المزيد من المعلومات
        </button>
      </div>
    </div>
  );
}

export default HomeBanner;
