import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="نسخة نتفليكس - تطبيق لتصفح الأفلام والمسلسلات" />
        <meta name="keywords" content="netflix, movies, tv shows, أفلام, مسلسلات, نتفليكس" />
        <meta name="author" content="Netflix Clone App" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="نسخة نتفليكس" />
        <meta property="og:description" content="تطبيق لتصفح الأفلام والمسلسلات مع إمكانية إضافة المفضلات" />
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
