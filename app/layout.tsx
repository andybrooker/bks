import "./globals.css";
import { manrope } from "./fonts/fonts";

export const metadata = {
  title: "Books",
  description: "Simple book tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
