import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./Components/ReactQueryProvider/ReactQueryProvider";
import ReduxProvider from "./ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aos Store",
  description: "Store Have Alot of products with high quality like Coffe,Oatsand alot of Snaks ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ReduxProvider>
              {children}
          </ReduxProvider>  
        </ReactQueryProvider>
      </body>
    </html>
  );
}
