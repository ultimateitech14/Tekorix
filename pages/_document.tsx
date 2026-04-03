import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/tekorix-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/tekorix-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/tekorix-logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
