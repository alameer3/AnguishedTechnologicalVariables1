import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { Details } from "../typings";
import BannerDetailsSkeleton from "./skeleton/BannerDetailsSkeleton";
import BannerSkeleton from "./skeleton/BannerSkeleton";

const baseUrl = "https://image.tmdb.org/t/p/original";

type Props = {
  movieDetails: Details | undefined;
};

function MainDetails({ movieDetails }: Props) {
  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12 lg:pl-24">
      <div className="absolute top-0 left-0 h-[100vh] w-screen -z-10 relative">
        {(movieDetails?.backdrop_path || movieDetails?.poster_path) ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src={`${baseUrl}${
                movieDetails.backdrop_path || movieDetails.poster_path
              }`}
              alt={
                movieDetails?.title ||
                movieDetails?.name ||
                movieDetails?.original_name || "Movie details"
              }
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
        ) : (
          <BannerSkeleton />
        )}

        <div className="absolute w-full h-32 bg-gradient-to-t from-gray-800 to-transparent bottom-0 z-20" />
      </div>

      {movieDetails?.title ||
      movieDetails?.name ||
      movieDetails?.original_name ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-2xl md:text-4xl lg:text-7xl font-black text-white text-shadow-enhanced leading-tight">
            {movieDetails?.title ||
              movieDetails?.name ||
              movieDetails?.original_name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-shadow-soft">
              {movieDetails.release_date ? `سنة الإصدار: ${new Date(movieDetails.release_date).getFullYear()}` : 'تاريخ غير متوفر'}
            </span>
            {(movieDetails as any).vote_average && (
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">
                ⭐ {((movieDetails as any).vote_average as number).toFixed(1)}
              </span>
            )}
            {(movieDetails as any).runtime && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-semibold text-shadow-soft">
                🕒 {(movieDetails as any).runtime} دقيقة
              </span>
            )}
          </div>
          
          <p className="max-w-xs text-gray-200 text-shadow-soft text-sm md:max-w-xl md:text-lg lg:max-w-3xl lg:text-xl line-clamp-4 leading-relaxed">
            {movieDetails?.overview || 'لا يوجد وصف متاح لهذا العنوان.'}
          </p>
        </motion.div>
      ) : (
        <BannerDetailsSkeleton />
      )}
    </div>
  );
}

export default MainDetails;
