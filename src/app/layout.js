"use client";

import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProtectedRoute from "../components/ProtectedRoute";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-arabic',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${notoSansArabic.className} ${notoSansArabic.variable}`}>
      <head>
        <title>Lexcora Client Portal</title>
        <meta name="description" content="Lexcora Client Portal System" />
      </head>
      <body className="font-system-arabic antialiased">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
