import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header'
import localFont from 'next/font/local'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const minecraftFont = localFont({
  src:'./fonts/minecraft.ttf',
  variable: '--font-minecraft'
})

export const metadata = {
  title: "MC Tools",
  description: "Minecraft Tools",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${minecraftFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header></Header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
