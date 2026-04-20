import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "NBA Tip-Off Time | NBA全チーム日程を日本時間で確認",
  description: "NBA全30チームの2025-26シーズン試合日程を日本時間（JST）で確認。Googleカレンダーへのワンクリック追加に対応。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
