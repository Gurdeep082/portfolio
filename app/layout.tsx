import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SplashScreen from "@/components/SplashScreen";

// Applies the saved theme before first paint so dark mode never flashes light.
const themeInitScript = `(()=>{try{const saved=localStorage.getItem("darkMode");const dark=saved===null||saved==="true";document.documentElement.classList.toggle("dark",dark)}catch{}})()`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gurdeep Singh | Full Stack Developer & Software Engineer",
  description: "Gurdeep Singh - Full Stack Developer specializing in MERN stack. Explore my portfolio with 10+ projects, skills in React, Next.js, Node.js, and MongoDB. Available for freelance work and collaborations.",
  keywords: ["Full Stack Developer", "MERN Stack", "React Developer", "Next.js", "Node.js", "Web Developer", "Software Engineer", "Portfolio"],
  authors: [{ name: "Gurdeep Singh" }],
  creator: "Gurdeep Singh",
  publisher: "Gurdeep Singh",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      {
        url: "/apple-touch-icon-180x180.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Gurdeep Singh Portfolio",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gurdeepsingh.portfolio",
    siteName: "Gurdeep Singh Portfolio",
    title: "Gurdeep Singh | Full Stack Developer & Software Engineer",
    description: "Explore Gurdeep Singh's portfolio - Full Stack Developer with expertise in MERN stack, React, Next.js, and more. 10+ projects showcased.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Gurdeep Singh Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gurdeep Singh | Full Stack Developer",
    description: "Explore my portfolio and projects. Full Stack Developer specializing in MERN stack.",
    creator: "@gurdeepsingh",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gurdeepsingh.portfolio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Gurdeep Singh",
              url: "https://gurdeepsingh.portfolio",
              jobTitle: "Full Stack Developer",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
              description: "Full Stack Developer specializing in MERN stack with 10+ completed projects",
              email: "sainigurdeep082@gmail.com",
              telephone: "+91 9034607228",
              knowsLanguage: ["en", "hi"],
              knowsAbout: ["React", "Next.js", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript", "REST API"],
              sameAs: [
                "https://github.com",
                "https://linkedin.com",
                "https://twitter.com",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-transparent text-[#123d3d] dark:bg-[#121212] dark:text-[#e0e0e0]">
        <SplashScreen />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
