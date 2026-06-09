import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Namaste",
    template: "%s | Namaste",
  },
  description: "Namaste Nepal",

  applicationName: "Namaste",

  metadataBase: new URL("https://devmind.com.np"),

  // temporary change
  // icons: {
  //   icon: "/logo.png",
  // },

  openGraph: {
    title: "Namaste",
    description:
      "Namaste",
    url: "https://devmind.com.np",
    siteName: "Namaste",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Namaste",
    description: "Official Namaste store.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* temporary change */}
        {/* <link rel="icon" href="/yumei_logo.png" /> */}

        {/* ✅ Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: " Namaste",
              url: "https://devmind.com.np",
            }),
          }}
        />
        <meta
          name="google-site-verification"
          content="4Pbvvp7u8ymUTbtietI_J_9ruHzdrzbDCRZofhLI2V4"
        />
      </head>
      <body suppressHydrationWarning={true} className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
