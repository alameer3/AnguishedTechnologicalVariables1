import {
  onSnapshot,
  collection,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BookmarkDashIcon, BookmarkCheckIcon, RemoveCircleIcon, AddCircleIcon } from "./Icons";
import { PopularTyping } from "../typings";
import { firestore } from "../firebase/firebase";

type Props = {
  castPerson: { 
    id: number; 
    name?: string; 
    profile_path?: string; 
    biography?: string;
    birthday?: string;
    place_of_birth?: string;
    known_for_department?: string;
  };
};

interface LikeDocument {
  id: string;
  data: () => PopularTyping;
}

function PersonBookMark({ castPerson }: Props) {
  const [hasLikes, setHasLikes] = useState(false);
  const { data: session } = useSession();
  const [likes, setLikes] = useState<LikeDocument[]>([]);

  useEffect(
    () =>
      onSnapshot(
        collection(
          firestore,
          "netflixUsers",
          (session?.user as { uid?: string })?.uid || "demouser",
          "likeActress"
        ),
        (snapshot) => {
          const documents: LikeDocument[] = snapshot.docs.map(doc => ({
            id: doc.id,
            data: () => doc.data() as PopularTyping
          }));
          setLikes(documents);
        }
      ),
    [firestore, (session?.user as { uid?: string })?.uid]
  );

  useEffect(
    () =>
      setHasLikes(
        likes.findIndex((like) => like.id === castPerson?.id.toString()!) !== -1
      ),
    [likes, castPerson]
  );

  const likeMovie = async () => {
    try {
      if (hasLikes) {
        await deleteDoc(
          doc(
            firestore,
            "netflixUsers",
            (session?.user as { uid?: string })?.uid || "demouser",
            "likeActress",
            castPerson?.id.toString()
          )
        );
      } else {
        const userRef = doc(
          firestore,
          "netflixUsers",
          (session?.user as { uid?: string })?.uid || "demouser",
          "likeActress",
          castPerson?.id.toString()
        );
        setDoc(userRef, JSON.parse(JSON.stringify(castPerson)));
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

export default PersonBookMark;
