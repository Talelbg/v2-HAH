import "./globals.css";

export const metadata = {
  title: "Real-Time Evaluation Platform",
  description: "Live evaluation dashboard powered by Next.js, Neon, and SWR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
