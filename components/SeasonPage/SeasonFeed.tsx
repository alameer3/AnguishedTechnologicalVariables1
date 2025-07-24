import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { SeasonDetail } from "../../typings";
import Footer from "../Footer";
import Navbar from "../Navbar";
import SeasonDetails from "./SeasonDetails";

type Props = {};

function SeasonFeed({}: Props) {
  const [seasons, setSeasons] = useState({});
  const [seasonVideo, setSeasonVideo] = useState([]);
  const router = useRouter();
  const { seasonId, seasonNumber } = router.query;

  const fetchData = async (seasonId: string | number, seasonNumber: string | number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        console.error('API key is missing');
        return;
      }

      const seasonsData = await fetch(
        `https://api.themoviedb.org/3/tv/${seasonId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      const seasonsVideo = await fetch(
        `https://api.themoviedb.org/3/tv/${seasonId}/season/${seasonNumber}/videos?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      setSeasons(seasonsData);
      setSeasonVideo(seasonsVideo.results || []);
    } catch (error) {
      console.error('Error fetching season data:', error);
    }
  };

  useEffect(() => {
    if (seasonId && seasonNumber) {
      const id = Array.isArray(seasonId) ? seasonId[0] : seasonId;
      const num = Array.isArray(seasonNumber) ? seasonNumber[0] : seasonNumber;
      fetchData(id, num);
    }
  }, [seasonId, seasonNumber]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main className="relative pl-4 pb-24 lg:space-y-24">
        <SeasonDetails
          seasons={seasons as SeasonDetail}
          seasonVideo={seasonVideo}
        />
      </main>
      <Footer />
    </div>
  );
}

export default SeasonFeed;
