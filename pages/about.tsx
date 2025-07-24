import { motion } from "framer-motion";
import Head from "next/head";
import SEOHead from "../components/SEOHead";

import React from "react";
import AboutFeed from "../components/AboutFeed";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type Props = {};

function AboutPage({}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <SEOHead 
        title="حول التطبيق - نسخة نتفليكس"
        description="معلومات حول تطبيق نسخة نتفليكس التعليمي"
      />
      <Navbar />
      <AboutFeed />
      <Footer />
    </motion.div>
  );
}

export default AboutPage;
