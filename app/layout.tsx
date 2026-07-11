import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qa-storming.web.app"),
  title: "QA Storming — Guild Knowledge Archive",
  description:
    "沿著生命樹探索 QA 團隊的 Onboarding、Regression Test Cases 與產品 Know-how。",
  robots: { index: false, follow: false },
  icons: { icon: "/favIcon.png", shortcut: "/favIcon.png" },
  openGraph: {
    title: "QA Storming — Guild Knowledge Archive",
    description: "沿著生命樹，探索團隊累積的測試智慧。",
    type: "website",
    images: [
      {
        url: "/rpg-life-tree.png",
        width: 1672,
        height: 941,
        alt: "QA Storming 奇幻生命樹知識基地",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Storming — Guild Knowledge Archive",
    description: "沿著生命樹，探索團隊累積的測試智慧。",
    images: ["/rpg-life-tree.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
