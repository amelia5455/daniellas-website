import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniella Mendoza – Client Intake",
  description: "Client intake quiz for Daniella Mendoza fitness coaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
