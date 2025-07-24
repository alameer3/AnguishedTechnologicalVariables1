import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import KnownFor from "./KnownFor";
import PersonBanner from "./PersonBanner";

interface Props {
  // No props needed for PersonFeed - gets data from router
}

function PersonFeed({}: Props) {
  const router = useRouter();
  const { castId } = router.query;
  const [castData, setCastData] = useState<any[]>([]);
  const [castPerson, setCastPerson] = useState<{ id: number; name?: string; profile_path?: string; biography?: string; birthday?: string; place_of_birth?: string }>({} as { id: number; name?: string; profile_path?: string; biography?: string; birthday?: string; place_of_birth?: string });

  const fetchData = async (id: string | number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        // API key missing - silent fail for production
        if (process.env.NODE_ENV === 'development') {
          console.warn('NEXT_PUBLIC_API_KEY is missing');
        }
        return;
      }

      const movieCastData = await fetch(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      const movieCastPersonData = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      setCastData(movieCastData.cast || []);
      setCastPerson(movieCastPersonData || {});
    } catch (error) {
      // Handle API errors gracefully
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to fetch person data:', error);
      }
      setCastData([]);
      setCastPerson({} as { id: number; name?: string; profile_path?: string; biography?: string; birthday?: string; place_of_birth?: string });
    }
  };

  useEffect(() => {
    if (castId && (typeof castId === 'string' || typeof castId === 'number')) {
      fetchData(castId);
    }
  }, [castId]);

  return (
    <main className="relative pl-4 pb-24 lg:space-y-24 overflow-x-hidden">
      <PersonBanner castPerson={castPerson as { id: number; name?: string; profile_path?: string; biography?: string; birthday?: string; place_of_birth?: string }} />
      <KnownFor castData={castData} />
    </main>
  );
}

export default PersonFeed;
