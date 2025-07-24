import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { BookmarkDashIcon, BookmarkCheckIcon, RemoveCircleIcon, AddCircleIcon } from "./Icons";
import { firestore } from "../firebase/firebase";

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
}

interface CustomSession {
  user?: {
    uid?: string;
    name?: string;
    email?: string;
  };
}

type Props = {
  movieDetails: MovieDetails;
};

function AddBookmark({ movieDetails }: Props) {
  const [hasLikes, setHasLikes] = useState(false);
  const { data: session } = useSession() as { data: CustomSession | null };
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    try {
      const uid = (session?.user as any)?.uid || "demouser";
      const unsubscribe = onSnapshot(
        collection(firestore, "netflixUsers", uid, "likeMovie"),
        (snapshot) => setLikes(snapshot.docs)
      );
      
      return () => unsubscribe();
    } catch (error) {
      // Firebase permission error with mock session - handled silently
    }
  }, [session?.user]);

  useEffect(() => {
    if (movieDetails?.id) {
      setHasLikes(
        likes.findIndex((like) => like.id === movieDetails.id.toString()) !== -1
      );
    }
  }, [likes, movieDetails?.id]);

  const likeMovie = async () => {
    try {
      if (hasLikes) {
        await deleteDoc(
          doc(
            firestore,
            "netflixUsers",
            (session?.user as any)?.uid || "demouser",
            "likeMovie",
            movieDetails?.id?.toString() || "unknown"
          )
        );
      } else {
        const userRef = doc(
          firestore,
          "netflixUsers",
          (session?.user as any)?.uid || "demouser",
          "likeMovie",
          movieDetails?.id?.toString() || "unknown"
        );
        setDoc(userRef, JSON.parse(JSON.stringify(movieDetails)));
      }
    } catch (error) {
      // Firebase permission error with mock session - handled silently
    }
  };

  return (
    <div className="flex justify-start px-8 bg-transparent items-center h-[100px] w-[550px] pb-0 rounded-lg shadow-xl z-[99] pt-4">
      <div className="flex justify-between items-center text-center">
        <button className="px-4 items-center text-center">
          {hasLikes ? (
            <BookmarkDashIcon className="h-8 w-8 text-red-500" />
          ) : (
            <BookmarkCheckIcon className="h-8 w-8 text-green-500" />
          )}
        </button>
        <div className="w-[250px]">
          <p className="text-xl font-medium">
            {hasLikes ? "Remove Your Favourite" : "Add Your Favourite"}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center text-center">
        {hasLikes ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-24 cursor-pointer px-2.5 py-2.5 bg-gray-900 rounded-full items-center hover:bg-red-300"
            onClick={() => likeMovie()}
          >
            <RemoveCircleIcon className="h-6 w-6 text-red-500" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-24 cursor-pointer px-2.5 py-2.5 bg-gray-900 rounded-full items-center hover:bg-green-300"
            onClick={() => likeMovie()}
          >
            <AddCircleIcon className="h-6 w-6 text-green-500" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default AddBookmark;

/*           id: movieDetails.id,
          title: movieDetails.title,
          backdrop_path: movieDetails.backdrop_path,
          media_type: type,
          release_date: movieDetails.release_date,
          original_language: movieDetails.original_language,
          original_name: movieDetails.original_title,
          overview: movieDetails.overview,
          popularity: movieDetails.popularity,
          poster_path: movieDetails.poster_path,
          vote_average: movieDetails.vote_average,
          vote_count: movieDetails.vote_count,
          timeStamp: Date.now().toLocaleString(), */
