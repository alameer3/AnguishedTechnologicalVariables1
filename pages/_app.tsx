import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import GlobalErrorBoundary from "../components/GlobalErrorBoundary";
import AuthProvider from "../components/AuthProvider";
import GuestModeNotice from "../components/GuestModeNotice";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalErrorBoundary>
      <SessionProvider session={pageProps.session}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <GuestModeNotice />
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SessionProvider>
    </GlobalErrorBoundary>
  );
}
