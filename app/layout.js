import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter=Inter({subsets: ["latin"]})

export const metadata = {
  title: "Ascent - Your Career Coach",
  description: "AI Career Coach",
};

export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider appearance={{
        baseTheme: "dark",
      }} >
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>© 2025 Ascent. All rights reserved.</p>
              </div>
            </footer>
            </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
