import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://qa-storming.web.app"),
  title: "QA Mission Control — Knowledge System",
  description: "QA 團隊的 Onboarding、Regression Test Cases 與產品 Know-how 知識基地。",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "QA Mission Control",
    description: "Explore. Verify. Deliver. QA 團隊的知識任務中心。",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "QA Mission Control 太空知識基地" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Mission Control",
    description: "Explore. Verify. Deliver. QA 團隊的知識任務中心。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
