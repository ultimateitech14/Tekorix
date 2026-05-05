import { Head, Html, Main, NextScript } from "next/document";

const faviconVersion = "20260505";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={`/favicon.ico?v=${faviconVersion}`} sizes="any" />
        <link rel="icon" href={`/favicon-tekorix.png?v=${faviconVersion}`} type="image/png" sizes="256x256" />
        <link rel="shortcut icon" href={`/favicon.ico?v=${faviconVersion}`} />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${faviconVersion}`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
