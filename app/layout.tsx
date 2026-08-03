import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "Tobby & Yuki | Pawsome by Design",
  description: "Premium pet lifestyle essentials for dogs and cats.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
        <Navbar />
        {children}
        <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
