import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FEIB AI Pilot Shopping Navigator",
  description: "遠東商銀 AI 智策助手",
  manifest: "/feib/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex justify-center min-h-screen">
        <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
