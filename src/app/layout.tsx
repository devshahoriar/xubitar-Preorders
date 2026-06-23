import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/shared/Header";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000/"),
  title: "Preorder Manager",
  description: "Xubitar Preorder Manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(geist.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
      suppressContentEditableWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <Header />
              {children}
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
