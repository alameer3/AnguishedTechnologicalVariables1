import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PeoplePopular from "../components/person/PeoplePopular";
import SEOHead from "../components/SEOHead";
import SignIn from "../components/SignIn";
import { PopularTyping } from "../typings";
import peopleRequests from "../utils/personRequest";

type Props = {
  popular: PopularTyping[];
  session: {
    user?: {
      uid?: string;
      name?: string;
      email?: string;
    };
  } | null;
};

function People({ popular, session }: Props) {
  // Skip authentication check for demo
  // if (!session) return <SignIn />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="المشاهير - نسخة نتفليكس"
        description="تصفح قائمة المشاهير والممثلين الأكثر شهرة وأعمالهم المميزة على نسخة نتفليكس"
      />
      <Navbar />
      <div className="bg-gradient-to-r from-gray-900">
        <main className="relative pl-4 pb-24 lg:space-y-24">
          <PeoplePopular popular={popular} />
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}

export default People;

export const getServerSideProps = async (context: { query: { id?: string } }) => {
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

  const [popular] = await Promise.all([
    fetch(peopleRequests.fetchPopular).then((res) => res.json()),
  ]);

  return {
    props: {
      popular: popular.results,
      session: mockSession,
    },
  };
};
