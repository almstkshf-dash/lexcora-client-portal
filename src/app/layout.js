"use client";

import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import ProtectedRoute from "../components/ProtectedRoute";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-arabic',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${notoSansArabic.className} ${notoSansArabic.variable}`}>
      <body className="font-system-arabic antialiased">
        <LanguageProvider>
          <AuthProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
