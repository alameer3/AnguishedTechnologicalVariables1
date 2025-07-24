import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Movie } from "../typings";
import AddBookmark from "./AddBookmark";
import BilledCast from "./BilledCast";
import Companies from "./Companies";
import Footer from "./Footer";
import MainDetails from "./MainDetails";
import MoreDetails from "./MoreDetails";
import Navbar from "./Navbar";
import Row from "./Row";
import Seasons from "./Seasons";
import Trailer from "./Trailer";

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: Array<{ id: number; name: string; logo_path?: string }>;
  spoken_languages?: Array<{ english_name: string }>;
  seasons?: Array<{ id: number; name: string; season_number: number; poster_path?: string; episode_count: number }>;
}

type Props = {
  netflixOriginals: Movie[];
};

function DetailsFeed({ netflixOriginals }: Props) {
  const router = useRouter();
  const { movieId, type } = router.query;
  const [movieTrailer, setMovieTrailer] = useState<{ results: Array<{ id: string; key: string; name: string; type: string }> }>({ results: [] });
  const [movieCast, setMovieCast] = useState<{ cast: Array<{ id: number; name: string; character: string; profile_path?: string }> }>({ cast: [] });
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  const fetchData = async (id: string | number, type: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        // API key missing - silent fail for production
        if (process.env.NODE_ENV === 'development') {
          console.warn('TMDB API key is missing');
        }
        return;
      }

      const movieVideo = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      const movieCast = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      const movieDetails = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`
      ).then((res) => res.json());

      setMovieTrailer(movieVideo);
      setMovieCast(movieCast);
      setMovieDetails(movieDetails);
    } catch (error) {
      // Handle API errors gracefully
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to fetch movie data:', error);
      }
      // Set empty states to prevent crashes
      setMovieTrailer({ results: [] });
      setMovieCast({ cast: [] });
      setMovieDetails(null);
    }
  };

  useEffect(() => {
    if (movieId && type && typeof movieId === 'string' && typeof type === 'string') {
      fetchData(movieId, type);
    }
  }, [movieId, type]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main className="relative pl-4 pb-24 lg:space-y-24">
        <MainDetails movieDetails={movieDetails} />
        <Companies movieDetails={movieDetails} />
        {movieDetails?.id && <AddBookmark movieDetails={movieDetails} />}
        <Trailer movieTrailer={movieTrailer} movieDetails={movieDetails} />
        <BilledCast movieCast={movieCast} />
        <MoreDetails movieDetails={movieDetails} />
        {type === "tv" && <Seasons movieDetails={movieDetails} />}
        <div className="pb-8">
          <Row
            title="More Like This"
            movies={netflixOriginals}
            isDetails={true}
            type="movie"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DetailsFeed;
