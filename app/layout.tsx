import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xristoforova20092010-sys.github.io/Project2/"),
  title: "English Adventure — The Lost Map",
  description: "Three interactive English-learning adventures for young explorers.",
  icons: { icon: "./favicon.svg" },
  openGraph: {
    title: "English Adventure — The Lost Map",
    description: "Three challenges. Three lost pieces. One legendary journey through English.",
    images: ["./og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "English Adventure — The Lost Map",
    description: "Three interactive English-learning adventures for young explorers.",
    images: ["./og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
