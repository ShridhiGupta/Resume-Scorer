import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Scorer",
  description:
    "AI-powered resume scoring and insights by Shridhi Gupta using Next.js, Node, and Python.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-white/60 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-fuchsia-500 text-white text-lg font-semibold shadow-sm">
                  RS
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    Resume Scorer
                  </div>
                  <p className="text-xs text-slate-500">
                    by Shridhi Gupta
                  </p>
                </div>
              </div>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
                <Link href="/" className="hover:text-sky-600">
                  Home
                </Link>
                <Link href="/analyze" className="hover:text-sky-600">
                  Analyze
                </Link>
                <Link href="/about" className="hover:text-sky-600">
                  About
                </Link>
                <Link href="/help" className="hover:text-sky-600">
                  Help
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-white/70 bg-slate-950 text-slate-100 mt-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Resume Scorer</h2>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                  A portfolio project by Shridhi Gupta showcasing AI-powered
                  resume analysis with Node.js and Python-backed insights.
                </p>
              </div>
              <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <div className="font-semibold text-slate-200">
                    Project
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-400">
                    <li>
                      <a
                        href="https://github.com/ShridhiGupta/Resume-Scorer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-300"
                      >
                        Source Code
                      </a>
                    </li>
                    <li>
                      <Link href="/help" className="hover:text-sky-300">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-sky-300">
                        About Project
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    Navigation
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-400">
                    <li>
                      <Link href="/" className="hover:text-sky-300">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/analyze" className="hover:text-sky-300">
                        Analyze
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-sky-300">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/help" className="hover:text-sky-300">
                        Help
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    Get in Touch
                  </div>
                  <p className="mt-2 text-slate-400">
                    Interested in this project or potential collaborations?
                  </p>
                  <a
                    href="mailto:guptashridhi11@gmail.com"
                    className="mt-3 inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-sky-600"
                  >
                    Contact Shridhi
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Resume Scorer. Built with Next.js,
              TypeScript, Node.js &amp; Python.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
