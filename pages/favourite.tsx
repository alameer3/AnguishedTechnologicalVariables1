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
  // تخطي صفحة التسجيل أثناء التطوير
  const isDevMode = process.env.NODE_ENV === 'development';
  const mockSession = {
    user: {
      uid: 'dev-user-123',
      name: 'مطور Yemen Flix',
      email: 'developer@yemenflix.com'
    }
  };
  
  const currentSession = isDevMode ? (session || mockSession) : session;
  
  if (!currentSession && !isDevMode) return <SignIn />;

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
      <FavoriteFeed session={currentSession} />
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
