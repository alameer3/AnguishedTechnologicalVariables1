import { onSnapshot, query, collection, orderBy, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Movie } from "../typings";

import { firestore } from "../firebase/firebase";
import Actress from "./Actress";
import EmptyMovie from "./EmptyMovie";
import Row from "./Row";

type Props = {
  session: { user?: { uid?: string; name?: string; email?: string } } | null;
};

interface MovieDocument {
  id: string;
  data: () => Movie;
}

function FavoriteFeed({ session }: Props) {
  const [likeMovies, setLikeMovies] = useState<MovieDocument[]>([]);
  const [isMovie, setIsMovie] = useState<boolean>(true);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        query(
          collection(
            firestore,
            "netflixUsers",
            (session?.user as { uid?: string })?.uid || "demouser",
            "likeMovie"
          ),
          orderBy("vote_average", "desc")
        ),
        (snapshot) => {
          const documents: MovieDocument[] = snapshot.docs.map(doc => ({
            id: doc.id,
            data: () => doc.data() as Movie
          }));
          setLikeMovies(documents);
        }
      );
      return unsubscribe;
    } catch (error) {
      // Firebase permission error with mock session - handled silently
    }
  }, [firestore, session?.user]);

  return (
    <main className="pl-4 pb-4 lg:space-y-24">
      <section className="md:space-y-16 pt-36 pb-4 mb-4">
        <div className="flex justify-start gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-xl font-semibold px-2.5 py-2.5 bg-transparent shadow-md hover:bg-gray-900 rounded-md ${
              isMovie && "bg-gray-900 shadow-2xl"
            }`}
            onClick={() => setIsMovie(true)}
          >
            Movie
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-xl font-semibold px-2.5 py-2.5 bg-transparent shadow-md hover:bg-gray-900 rounded-md ${
              !isMovie && "bg-gray-900 shadow-2xl"
            }`}
            onClick={() => setIsMovie(false)}
          >
            Actress
          </motion.button>
        </div>
        {isMovie ? (
          <>
            {likeMovies.length > 0 ? (
              <Row
                likeMovies={likeMovies}
                isDetails={true}
                type="movie"
                isSearch={true}
                isfavourite={true}
              />
            ) : (
              <EmptyMovie />
            )}
          </>
        ) : (
          <Actress session={session} />
        )}
      </section>
    </main>
  );
}

export default FavoriteFeed;
