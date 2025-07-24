import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import SEOHead from "../components/SEOHead";
import FavoriteFeed from "../components/FavoriteFeed";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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

function Favorite({ session }: Props) {
  if (!session) return <SignIn />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="المفضلة - نسخة نتفليكس"
        description="قائمة الأفلام والمسلسلات المفضلة لديك"
      />
      <Navbar />
      <FavoriteFeed session={session} />
      <Footer />
    </motion.div>
  );
}

export default Favorite;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
