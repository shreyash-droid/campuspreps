import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import AIChatButtonWrapper from './components/AIChatButtonWrapper';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial serif display for headlines — pairs with Geist for body/UI.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Campus Preps",
  description: "Your one stop solution for all exam preparations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <AuthProvider>
          <FavoritesProvider>
            {children}
            <AIChatButtonWrapper />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
