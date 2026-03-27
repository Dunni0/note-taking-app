import "./globals.css";
import { SessionWrapper } from "@/components/SessionWrapper";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { QueryProvider } from "@/providers/QueryProvider";


export const metadata = {
  title: "Note Taking",
  description: "Your thoughts, organised. Write, tag, search, and archive your notes — all in one place.",
   icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <SessionWrapper>
            <ReduxProvider>
              {children}
            </ReduxProvider>
          </SessionWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
