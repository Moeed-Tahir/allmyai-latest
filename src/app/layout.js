import "./globals.css";

export const metadata = {
  title: "AllMyAI Coming Soon",
  description: "Stay tuned for something amazing!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundImage: "url('/bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
