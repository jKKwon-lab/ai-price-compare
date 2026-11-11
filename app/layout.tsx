import { GoogleAnalytics } from '@next/third-parties/google';
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
    google: "rdrqkUFJhlrgBDM_w3wZwOK3NKg1XSDpqiK1dWWw7fc",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
      <GoogleAnalytics gaId="G-7JZPRCSLCH" /> 
    </html>
  );
}