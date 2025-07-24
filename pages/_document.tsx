import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>

        <meta name="theme-color" content="#000000" />
        <meta name="description" content="YEMEN_FLIX - منصة البث الأولى في اليمن للأفلام والمسلسلات" />
        <meta name="keywords" content="yemen flix, movies, tv shows, أفلام, مسلسلات, يمن فليكس, اليمن" />
        <meta name="author" content="YEMEN_FLIX" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="YEMEN_FLIX - منصة الأفلام والمسلسلات" />
        <meta property="og:description" content="استمتع بأحدث الأفلام والمسلسلات على YEMEN_FLIX - منصة البث الأولى في اليمن" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </Head>
      <body className="bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
