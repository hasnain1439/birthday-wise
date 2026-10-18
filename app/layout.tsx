import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Happy Birthday, Usama Riaz 🎂",
  description: "Celebrating Usama Riaz — Software Engineer and birthday legend. Open your cake, blow the candles and leave a wish!",
  openGraph: {
    title: "Happy Birthday, Usama Riaz 🎂",
    description: "Open the cake, blow the candles and leave a birthday wish for Usama!",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07050d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
