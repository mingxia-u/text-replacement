import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "文字替换助手",
  description: "上传 Word，按自定义词库替换文字并保留原始格式。",
  openGraph: {
    title: "文字替换助手",
    description: "只替换文字，原始格式保持不变。",
    images: [{ url: "/og.png", width: 1792, height: 909 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
