import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Gurdeep Singh | Full Stack Developer & Software Engineer",
  description: "Gurdeep Singh - Full Stack Developer specializing in MERN stack. Explore my portfolio with 10+ projects, skills in React, Next.js, Node.js, and MongoDB. Available for freelance work and collaborations.",
  keywords: ["Full Stack Developer", "MERN Stack", "React Developer", "Next.js", "Node.js", "Web Developer", "Software Engineer", "Portfolio"],
  authors: [{ name: "Gurdeep Singh" }],
  creator: "Gurdeep Singh",
  publisher: "Gurdeep Singh",
  formatDetection: {
    email: true,
    telephone: true,
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#123d3d" />
        <meta name="msapplication-TileColor" content="#123d3d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://localhost:5000" />
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
      <body className="min-h-full bg-[#edf5f1] text-[#123d3d]">{children}</body>
    </html>
  );
}
