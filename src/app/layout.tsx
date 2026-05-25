import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../../SessionWrapper";
import { Toaster } from "react-hot-toast";
import Footer from "@/modules/shared/components/Footer";
import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Milan Pitagaldeniya",
  description: "Online Learning Platform",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased mb-10`}>
       
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 5000,
            removeDelay: 1000,
            style: {
              borderRadius: "0px",
              boxShadow: "none",
            },

            success: {
              className: "!text-zinc-50 !bg-zinc-600",
              duration: 3000,
              iconTheme: {
                primary: "var(--toast-icon-success-primary)",
                secondary: "var(--toast-icon-success-secondary)",
              },
            },

            loading: {
              className: "!text-zinc-50 !bg-zinc-600",
              duration: 7000,
              iconTheme: {
                primary: "var(--toast-icon-success-primary)",
                secondary: "var(--toast-icon-success-secondary)",
              },
            },
            error: {
              className: "!bg-red-50 !text-red-600",
              duration: 5000,
              iconTheme: {
                primary: "var(--toast-icon-error-primary)",
                secondary: "var(--toast-icon-error-secondary)",
              },
            },
          }}
        />
        <SessionWrapper>
          <Suspense
            fallback={
              <div className="my-10">
                <Spinner />
              </div>
            }
          >
            {children}
          </Suspense>

          <Footer />
          <Analytics/>
        </SessionWrapper>
         
      </body>
    </html>
  );
}
