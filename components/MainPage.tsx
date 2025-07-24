import React, { useEffect, useState } from "react";

import { Movie } from "../typings";
import Footer from "./Footer";
import HomeBanner from "./HomeBanner";
import Navbar from "./Navbar";
import Row from "./Row";

type Props = {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  session: { user?: { name?: string; email?: string; image?: string } } | null;
};

function MainPage({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaries,
  session,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMovie, setSearchMovie] = useState<Movie[]>([]);

  const fetchData = async (searchItem: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.TMDB_API_KEY;
      if (!apiKey) {
        // API key missing - silent fail for production
        if (process.env.NODE_ENV === 'development') {
          // API key missing - silent fail for production
        }
        return;
      }
      
      const movieSearchdata = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${searchItem}&page=1&include_adult=false`
      ).then((res) => res.json());
      setSearchMovie(movieSearchdata.results || []);
    } catch (error) {
      // Handle search errors gracefully
      if (process.env.NODE_ENV === 'development') {
        // Failed to search movies - silent fail for production
      }
      setSearchMovie([]);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchData(searchTerm.toLowerCase());
    } else return;
  }, [searchTerm]);

  return (
    <>
      <Navbar
        isSearch={true}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      {searchTerm ? (
        <main className="pl-4 pb-4 lg:space-y-24">
          <section className="md:space-y-16 pt-36 pb-4 mb-4">
            <Row
              movies={searchMovie}
              isDetails={true}
              type="movie"
              isSearch={true}
            />
          </section>
        </main>
      ) : (
        <main className="relative pl-4 pb-24 lg:space-y-24">
          <HomeBanner
            netflixOriginals={netflixOriginals}
            session={session}
            isTv={false}
          />
          <section className="md:space-y-16">
            <Row
              title="Trending Now"
              movies={trendingNow}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Top Rated"
              movies={topRated}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Action Thrillers"
              movies={actionMovies}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Comedies"
              movies={comedyMovies}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Scary Movies"
              movies={horrorMovies}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Romance Movies"
              movies={romanceMovies}
              isDetails={false}
              type="movie"
            />
            <Row
              title="Documentaries"
              movies={documentaries}
              isDetails={false}
              type="movie"
            />
          </section>
        </main>
      )}
      <Footer />
    </>
  );
}

export default MainPage;
