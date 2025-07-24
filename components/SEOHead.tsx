import Head from 'next/head';
import DOMPurify from 'dompurify';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "YEMEN_FLIX - منصة الأفلام والمسلسلات الأولى في اليمن",
  description = "استمتع بأحدث الأفلام والمسلسلات على YEMEN_FLIX - منصة البث الأولى في اليمن مع إمكانية إضافة المفضلات",
  image = "/yemen-flix-logo.png",
  url = "",
  type = "website"
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Arabic" />
      <meta name="author" content="YEMEN_FLIX" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="YEMEN_FLIX" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/yemen-flix-icon.png" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: typeof window !== 'undefined' 
            ? DOMPurify.sanitize(JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "YEMEN_FLIX",
                "description": description,
                "url": url,
                "applicationCategory": "Entertainment",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }))
            : JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "YEMEN_FLIX",
                "description": description,
                "url": url,
                "applicationCategory": "Entertainment",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              })
        }}
      />
    </Head>
  );
};

export default SEOHead;