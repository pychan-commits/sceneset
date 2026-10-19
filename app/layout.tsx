import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SceneSet — Make the next move obvious",
  description: "A calm control room for good events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
