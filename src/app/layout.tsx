import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Chakra_Petch, Black_Ops_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const blackOpsOne = Black_Ops_One({
  variable: "--font-black-ops",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "TEAM MATRIX",
  description: "Official Team Matrix Website",
  icons: {
    icon: "/faviconfinal.png",
    shortcut: "/faviconfinal.png",
    apple: "/faviconfinal.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${chakraPetch.variable} ${blackOpsOne.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}


