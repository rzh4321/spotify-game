import type { Metadata } from "next";
import "@/app/globals.css";
import Provider from "@/components/Provider";
import NavBar from "@/components/NavBar";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Guessify",
  description: "The Spotify Guessing Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <QueryProvider>
          <body className="dark px-5 font-primary flex flex-col h-screen justify-between items-center">
            <div className="bg-inherit w-full">
              <NavBar />
              {children}
            </div>
            <Toaster />
            {/*
              <Footer /> */}
          </body>
        </QueryProvider>
      </Provider>
    </html>
  );
}
