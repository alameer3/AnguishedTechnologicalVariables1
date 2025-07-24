import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import KnownFor from "./KnownFor";
import PersonBanner from "./PersonBanner";

type Props = {};

function PersonFeed({}: Props) {
  const router = useRouter();
  const { castId } = router.query;
  const [castData, setCastData] = useState([]);
  const [castPerson, setCastPerson] = useState<any>({});

  const fetchData = async (id: string | number) => {
    const movieCastData = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    ).then((res) => res.json());

    const movieCastPersonData = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`
    ).then((res) => res.json());

    setCastData(movieCastData.cast);
    setCastPerson(movieCastPersonData);
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
