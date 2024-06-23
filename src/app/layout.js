import { Inter } from "next/font/google";
import "@styles/globals.css";
import { ScreenDimensionsProvider } from "@lib/ScreenDimensionsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fornax AI",
  description: "A Pitch Script Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScreenDimensionsProvider>{children}</ScreenDimensionsProvider>
      </body>
    </html>
  );
}
