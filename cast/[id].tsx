import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonFeed from "../components/person/PersonFeed";
import SEOHead from "../components/SEOHead";
import SignIn from "../components/SignIn";

type Props = {
  session: {
    user?: {
      uid?: string;
      name?: string;
      email?: string;
    };
  } | null;
};

function CastPage({ session }: Props) {
  // Skip authentication check for demo
  // if (!session) return <SignIn />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="الممثلون والممثلات - نسخة نتفليكس"
        description="استكشف أشهر الممثلين والممثلات وأعمالهم على نسخة نتفليكس"
      />
      <Navbar />
      <div className="bg-gradient-to-r from-gray-900">
        <PersonFeed />
        <Footer />
      </div>
    </motion.div>
  );
}

export default CastPage;

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

  return {
    props: {
      session: mockSession,
    },
  };
};
