import "./globals.css";

export const metadata = {
  title: "AllMyAI - Coming Soon",
  description: "Stay tuned for something amazing!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
