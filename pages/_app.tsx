import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorFallback from "../components/ErrorFallback";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ErrorBoundary>
  );
}
