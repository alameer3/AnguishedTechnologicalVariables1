import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";

import DetailsFeed from "../../components/DetailsFeed";
import SEOHead from "../../components/SEOHead";
import SignIn from "../../components/SignIn";
import { Movie } from "../../typings";
import requests from "../../utils/requests";

type Props = {
  netflixOriginals: Movie[];
  session: {
    user?: {
      uid?: string;
      name?: string;
      email?: string;
    };
  } | null;
};

function Details({ netflixOriginals, session }: Props) {
  // Skip authentication check for demo
  // if (!session) return <SignIn />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="تفاصيل الفيلم - نسخة نتفليكس"
        description="اكتشف تفاصيل الأفلام والمسلسلات مع طاقم التمثيل والمراجعات على نسخة نتفليكس"
      />
      <DetailsFeed netflixOriginals={netflixOriginals} />
    </motion.div>
  );
}

export default Details;

export const getServerSideProps = async (context: { query: { id: string } }) => {
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
  
  const [netflixOriginals] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      session: mockSession,
    },
  };
};
