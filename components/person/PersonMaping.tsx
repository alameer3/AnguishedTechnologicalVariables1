import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";

import { PopularTyping } from "../../typings";

type Props = {
  person: PopularTyping;
  baseUrl: string;
};

function PersonMaping({ person, baseUrl }: Props) {
  const router = useRouter();

  const handleNavigatePage = () => {
    router.push({
      pathname: `/cast/${person.id}`,
      query: {
        castId: person.id.toString(),
      },
    });
  };

  return (
    <motion.div
      className="bg-transparent relative cursor-pointer items-center px-2 py-2 rounded-md shadow-2xl hover:bg-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onClick={handleNavigatePage}
    >
      {person.profile_path ? (
        <div className="relative w-56 h-80 mx-auto">
          <Image
            src={`${baseUrl}${person.profile_path}`}
            alt={person.name || "Actor profile"}
            fill
            className="object-cover rounded"
            sizes="224px"
          />
        </div>
      ) : (
        <div className="w-56 h-80 bg-gray-700 rounded flex items-center justify-center mx-auto">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}
      <h1 className="text-gray-300 font-bold text-xl text-center py-2 line-clamp-3">
        {person.name}
      </h1>
      <div className="text-white px-2.5 py-2.5 text-sm flex justify-between">
        <p>{person.known_for_department}</p>|
        <p>popularity: {person.popularity}</p>
      </div>
    </motion.div>
  );
}

export default PersonMaping;
