import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

import SeasonFeed from "../../components/SeasonPage/SeasonFeed";
import SEOHead from "../../components/SEOHead";
import SignIn from "../../components/SignIn";

type Props = {
  session: {
    user?: {
      uid?: string;
      name?: string;
      email?: string;
    };
  } | null;
};

function SeasonPage({ session }: Props) {
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
        title="موسم المسلسل - نسخة نتفليكس"
        description="شاهد حلقات المسلسل والموسم الكامل مع التفاصيل والمراجعات على نسخة نتفليكس"
      />
      <SeasonFeed />
    </motion.div>
  );
}

export default SeasonPage;

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

  return {
    props: {
      session: mockSession,
    },
  };
};
