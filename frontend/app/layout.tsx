import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookstore — คลังหนังสือและระบบจัดการหนังสือ",
  description: "ระบบคลังหนังสือ ค้นหา กรองตามหมวดหมู่ ผู้แต่ง และระบบจัดการสำหรับ Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-800">
        {children}
      </body>
    </html>
  );
}
