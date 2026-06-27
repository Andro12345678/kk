import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "المنصة القانونية | البحث الذكي في القانون المصري",
  description:
    "ابحث عن إجاباتك القانونية بسهولة. منصة ذكية تجيب على أسئلتك القانونية بالعربية المصرية.",
  keywords:
    "قانون مصري، استشارات قانونية، بحث قانوني، حقوق المواطن، القانون المصري",
  authors: [{ name: "المنصة القانونية" }],
  openGraph: {
    title: "المنصة القانونية | البحث الذكي",
    description: "ابحث عن إجاباتك القانونية بسهولة",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;500;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
