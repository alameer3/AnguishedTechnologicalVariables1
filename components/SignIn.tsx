import { motion } from "framer-motion";
import Head from "next/head";
import React from "react";

import Children from "./Children";
import DownloadShows from "./DownloadShows";
import EnjoyOnTv from "./EnjoyOnTv";
import Footer from "./Footer";
import Membership from "./Membership";
import Questions from "./Questions";
import SigninBanner from "./SigninBanner";

type Props = {};

function SignIn({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>نتفليكس - أفلام ومسلسلات بلا حدود</title>
        <meta name="description" content="شاهد أفلامك ومسلسلاتك المفضلة بجودة عالية وبلا حدود على نتفليكس" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="نتفليكس, أفلام, مسلسلات, ترفيه, مشاهدة أونلاين" />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <main>
        <div className="bg-[#000000]">
          <SigninBanner />
          <EnjoyOnTv />
          <DownloadShows />
          <Children />
          <div className="border-b-8 border-gray-800 pb-8">
            <Questions />
            <Membership />
          </div>
          <Footer />
        </div>
      </main>
    </motion.div>
  );
}

export default SignIn;
