import React from "react";
import Image from "next/image";

import type { Companies, Details } from "../typings";

const baseUrl = "https://image.tmdb.org/t/p/original";

type Props = {
  movieDetails: Details | undefined;
};

function Companies({ movieDetails }: Props) {
  return (
    <div className="flex justify-start gap-10 items-center px-8">
      {movieDetails?.production_companies?.map((companies: Companies) => (
        <div key={companies.id}>
          {companies.logo_path ? (
            <div className="relative w-36 h-20">
              <Image
                src={`${baseUrl}${companies.logo_path}`}
                alt={companies.name || "Production company logo"}
                fill
                className="object-contain shadow-xl"
                sizes="144px"
              />
            </div>
          ) : (
            <div className="w-36 h-20 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400 text-sm">{companies.name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Companies;
