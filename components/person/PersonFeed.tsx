import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import KnownFor from "./KnownFor";
import PersonBanner from "./PersonBanner";

interface Props {
  // No props needed for PersonFeed - gets data from router
}

interface CastMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  character?: string;
}

interface PersonData {
  id: number;
  name?: string;
  profile_path?: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for_department?: string;
}

function PersonFeed({}: Props) {
  const router = useRouter();
  const { castId } = router.query;
  const [castData, setCastData] = useState<CastMovie[]>([]);
  const [castPerson, setCastPerson] = useState<PersonData | null>(null);

  const fetchData = async (id: string | number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        // API key missing - silent fail for production
        return;
      }

      const movieCastData = await fetch(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      const movieCastPersonData = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      setCastData(movieCastData.cast || []);
      setCastPerson(movieCastPersonData || null);
    } catch (error) {
      // Handle API errors gracefully
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to fetch person data:', error);
      }
      setCastData([]);
      setCastPerson(null);
    }
  };

  useEffect(() => {
    if (castId && (typeof castId === 'string' || typeof castId === 'number')) {
      fetchData(castId);
    }
  }, [castId]);

  return (
    <main className="relative pl-4 pb-24 lg:space-y-24 overflow-x-hidden">
      {castPerson && <PersonBanner castPerson={castPerson} />}
      <KnownFor castData={castData} />
    </main>
  );
}

export default PersonFeed;
