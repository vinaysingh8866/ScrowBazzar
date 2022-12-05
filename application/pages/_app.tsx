import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NativeBaseProvider } from "native-base";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <NativeBaseProvider isSSR>
        <Component {...pageProps} />
      </NativeBaseProvider>
    </SessionProvider>
  );
}

export default MyApp;
