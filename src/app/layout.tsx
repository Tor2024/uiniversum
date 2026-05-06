import type { Metadata } from "next";
import "./globals.css";

// Root layout — minimal wrapper.
// The [lang] layout provides <html>, <head>, and <body> for the public site.
// The admin layout inherits this wrapper and adds its own structure.
export const metadata: Metadata = {
  title: "1universum CMS",
  description: "Website builder admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
