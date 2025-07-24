import { onSnapshot, collection, orderBy, query, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { PopularTyping } from "../typings";

import { firestore } from "../firebase/firebase";
import EmptyMovie from "./EmptyMovie";
import LikeActress from "./LikeActress";

const baseUrl = "https://image.tmdb.org/t/p/original";

type Props = {
  session: { user?: { uid?: string; name?: string; email?: string } } | null;
};

interface PersonData {
  id: number; 
  name: string; 
  profile_path?: string; 
  popularity: number;
  adult?: boolean;
  gender?: number;
  known_for_department?: string;
}

interface ActressDocument {
  id: string;
  data: () => PopularTyping;
}

function Actress({ session }: Props) {
  const [likeActress, setLikeAlikeActress] = useState<ActressDocument[]>([]);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        query(
          collection(
            firestore,
            "netflixUsers",
            (session?.user as { uid?: string })?.uid || "demouser",
            "likeActress"
          ),
          orderBy("popularity", "desc")
        ),
        (snapshot) => setLikeAlikeActress(snapshot.docs as unknown as ActressDocument[])
      );
      return unsubscribe;
    } catch (error) {
      // Firebase permission error with mock session - handled silently
    }
  }, [firestore, session?.user]);

  return (
    <div className="overflow-x-hidden">
      {likeActress.length > 0 ? (
        <div
          className={
            likeActress.length >= 6
              ? `grid space-x-5 space-y-8 pt-0`
              : `flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2`
          }
        >
          {likeActress?.map((person) => (
            <LikeActress
              key={person.id}
              person={person.data() as PopularTyping}
              baseUrl={baseUrl}
            />
          ))}
        </div>
      ) : (
        <EmptyMovie />
      )}
    </div>
  );
}

export default Actress;
