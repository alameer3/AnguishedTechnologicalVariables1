import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";
import SEOHead from "../components/SEOHead";
import React from "react";

import Footer from "../components/Footer";
import HomeBanner from "../components/HomeBanner";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import SignIn from "../components/SignIn";
import { Movie } from "../typings";
import tvRequests from "../utils/tvSeasonRequest";

type Props = {
  topRated: Movie[];
  onTheAirTv: Movie[];
  popularTv: Movie[];
  session: {
    user?: {
      uid?: string;
      name?: string;
      email?: string;
    };
  } | null;
};

function TvSeasons({ topRated, onTheAirTv, popularTv, session }: Props) {
  // Skip authentication check for demo
  // if (!session) return <SignIn />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="المسلسلات - نسخة نتفليكس"
        description="تصفح أحدث المسلسلات التلفزيونية والعروض"
      />
      <Navbar />
      <main className="relative pl-4 pb-24 lg:space-y-24">
        <HomeBanner netflixOriginals={topRated} isTv={true} />
        <section className="md:space-y-16">
          <Row
            title="Trending Now"
            movies={topRated.slice(0, 10)}
            isDetails={false}
            type="tv"
          />
          <Row
            title="Trending Now"
            movies={onTheAirTv.slice(0, 10)}
            isDetails={false}
            type="tv"
          />
          <Row
            title="Top Rated"
            movies={onTheAirTv.slice(10, onTheAirTv.length)}
            isDetails={false}
            type="tv"
          />
          <Row
            title="Action"
            movies={popularTv.slice(0, 10)}
            isDetails={false}
            type="tv"
          />
          <Row
            title="Latest"
            movies={popularTv.slice(10, popularTv.length)}
            isDetails={false}
            type="tv"
          />
        </section>
      </main>
      <Footer />
    </motion.div>
  );
}

export default TvSeasons;

export const getServerSideProps = async (context: { query?: { id?: string } }) => {
  // Create mock session to bypass authentication
  const mockSession = {
    user: {
      name: "Demo User",
      email: "demo@netflix.com",
      image: "https://i.imgur.com/HeIi0wU.png",
      username: "demouser",
      uid: "demo-uid-12345"
    }
  };

  const [topRated, onTheAirTv, popularTv] = await Promise.all([
    fetch(tvRequests.fetchTopRated).then((res) => res.json()),
    fetch(tvRequests.fetchOnTheAir).then((res) => res.json()),
    fetch(tvRequests.fetchPopular).then((res) => res.json()),
  ]);

  return {
    props: {
      topRated: topRated.results,
      onTheAirTv: onTheAirTv.results,
      popularTv: popularTv.results,
      session: mockSession,
    },
  };
};
