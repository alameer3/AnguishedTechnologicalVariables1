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
  if (!session) return <SignIn />;

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

export const getServerSideProps = async (context: { req: any; res: any }) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
