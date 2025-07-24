import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorFallback from "../components/ErrorFallback";
import { ThemeProvider } from "../context/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
