import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://schonebus.nl"),
  title: "schonebus.nl — fiscaal voordeel op je elektrische bestelbus",
  description:
    "Bereken in 30 seconden wat je terugkrijgt via MIA, Vamil en KIA op je nieuwe elektrische bestelbus. No cure, no pay.",
  openGraph: {
    title: "schonebus.nl — fiscaal voordeel op je elektrische bestelbus",
    description:
      "Bereken in 30 seconden wat je terugkrijgt via MIA, Vamil en KIA op je nieuwe elektrische bestelbus. No cure, no pay.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "schonebus.nl",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1B3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
