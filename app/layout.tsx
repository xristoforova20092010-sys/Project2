import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "English Adventure — The Lost Map",
    description: "Three interactive English-learning adventures for young explorers.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "English Adventure — The Lost Map", description: "Three challenges. Three lost pieces. One legendary journey through English.", images: [`${origin}/og.png`] },
    twitter: { card: "summary_large_image", title: "English Adventure — The Lost Map", description: "Three interactive English-learning adventures for young explorers.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
