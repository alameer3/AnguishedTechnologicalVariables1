import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import GlobalErrorBoundary from "../components/GlobalErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalErrorBoundary>
      <SessionProvider session={pageProps.session}>
        <div className="min-h-screen bg-gray-900 text-white">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </GlobalErrorBoundary>
  );
}
