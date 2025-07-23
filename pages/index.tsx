import { motion } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

import MainPage from "../components/MainPage";
import SignIn from "../components/SignIn";
import DemoAccess from "../components/DemoAccess";
import { Movie } from "../typings";
import cachedRequests from "../utils/apiWithCache";

type Props = {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
};

export default function Home({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaries,
}: Props) {
  const { data: session } = useSession();
  const [demoMode, setDemoMode] = useState(false);
  
  // التحقق من وجود مفاتيح Google OAuth
  const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  
  // إذا لم تكن هناك مفاتيح Google ولم يتم تفعيل الوضع التوضيحي
  if (!hasGoogleKeys && !demoMode) {
    return <DemoAccess onDemoAccess={() => setDemoMode(true)} />;
  }
  
  // إذا كانت هناك مفاتيح Google ولكن المستخدم غير مسجل الدخول
  if (hasGoogleKeys && !session) {
    return <SignIn />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>نتفليكس - الصفحة الرئيسية</title>
        <meta name="description" content="اكتشف أحدث الأفلام والمسلسلات على نتفليكس. شاهد بلا حدود." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://www.designbust.com/download/1037/png/netflix_logo_png_transparet512.png"
        />
      </Head>
      <MainPage
        netflixOriginals={netflixOriginals}
        trendingNow={trendingNow}
        topRated={topRated}
        actionMovies={actionMovies}
        comedyMovies={comedyMovies}
        horrorMovies={horrorMovies}
        romanceMovies={romanceMovies}
        documentaries={documentaries}
        session={session || { user: { name: "مستخدم تجريبي", email: "demo@example.com" } }}
      />
    </motion.div>
  );
}

export const getServerSideProps = async (context: any) => {
  try {
    const session = await getSession(context);

    const [
      netflixOriginals,
      trendingNow,
      topRated,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
      documentaries,
    ] = await Promise.all([
      cachedRequests.fetchNetflixOriginals().catch(() => ({ results: [] })),
      cachedRequests.fetchTrending().catch(() => ({ results: [] })),
      cachedRequests.fetchTopRated().catch(() => ({ results: [] })),
      cachedRequests.fetchActionMovies().catch(() => ({ results: [] })),
      cachedRequests.fetchComedyMovies().catch(() => ({ results: [] })),
      cachedRequests.fetchHorrorMovies().catch(() => ({ results: [] })),
      cachedRequests.fetchRomanceMovies().catch(() => ({ results: [] })),
      cachedRequests.fetchDocumentaries().catch(() => ({ results: [] })),
    ]);

    return {
      props: {
        netflixOriginals: netflixOriginals?.results || [],
        trendingNow: trendingNow?.results || [],
        topRated: topRated?.results || [],
        actionMovies: actionMovies?.results || [],
        comedyMovies: comedyMovies?.results || [],
        horrorMovies: horrorMovies?.results || [],
        romanceMovies: romanceMovies?.results || [],
        documentaries: documentaries?.results || [],
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching data:', error);
    }
    return {
      props: {
        netflixOriginals: [],
        trendingNow: [],
        topRated: [],
        actionMovies: [],
        comedyMovies: [],
        horrorMovies: [],
        romanceMovies: [],
        documentaries: [],
      },
    };
  }
};