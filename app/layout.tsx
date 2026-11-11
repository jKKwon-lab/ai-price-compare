import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "글로벌 AI 모델 실시간 단가 비교",
  description: "OpenAI, Anthropic, Google 등 전 세계 주요 LLM API의 1M 토큰당 가격과 스펙을 한눈에 비교하세요.",
  verification: {
    google: "hSa-YUCM44dTPWSkjgzOVnMkYWbHgeueuB5CCHww91I",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
