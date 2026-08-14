"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Code,
  Briefcase,
  Users,
  Rocket,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

type ProjectImage = string | File;

type Project = {
  _id?: string;
  title: string;
  description: string;
  stack?: string;
  demoLink?: string;
  githubLink?: string;
  link?: string;
  images?: ProjectImage[];
  createdAt?: string;
};

type SettingsResponse = {
  resume?: string;
  resumeName?: string;
};

const normalizeProjectImageSource = (
  image: unknown,
  apiBase: string,
): string | null => {
  if (!image) return null;

  if (typeof image === "string") {
    const value = image.trim();

    if (!value) return null;

    if (value.startsWith("data:image/")) {
      return value;
    }

    if (value.includes("drive.google.com")) {
      const fileId =
        value.match(/\/file\/d\/([^/?]+)/)?.[1] ||
        value.match(/[?&]id=([^&]+)/)?.[1];

      if (fileId) {
        return `${apiBase}/api/project-images/${encodeURIComponent(fileId)}`;
      }

      return null;
    }

    if (
      value.startsWith("https://") ||
      value.startsWith("http://") ||
      value.startsWith("/")
    ) {
      return value;
    }

    return null;
  }

  if (typeof image === "object") {
    const obj = image as Record<string, unknown>;

    return normalizeProjectImageSource(
      obj.url ??
        obj.src ??
        obj.imageUrl ??
        obj.secure_url ??
        obj.path ??
        obj.data ??
        null,
      apiBase,
    );
  }

  return null;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fallbackProjects: Project[] = [
  {
    title: "Velora",
    description:
      "A premium fashion e-commerce platform with MERN stack, stripe payment & admin dashboard.",
    stack: "MongoDB, Express, React, Node",
    demoLink: "https://example.com/velora",
    githubLink: "https://github.com/username/velora",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    title: "Taskiva",
    description:
      "A task management app with authentication, real-time updates, and team collaboration.",
    stack: "Next.js, Prisma, PostgreSQL",
    demoLink: "https://example.com/taskiva",
    githubLink: "https://github.com/username/taskiva",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    title: "BizBiteNow",
    description:
      "Restaurant ordering system with menu management, cart, and order tracking.",
    stack: "React, Firebase, Stripe",
    demoLink: "https://example.com/bizbitenow",
    githubLink: "https://github.com/username/bizbitenow",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const skillItems = [
  { name: "React", icon: "/React.svg" },
  { name: "Node.js", icon: "/Node.js.svg" },
  { name: "Express", icon: "/Node.js.svg" },
  { name: "MongoDB", icon: "/mongodb.svg" },
  { name: "Next.js", icon: "/Next.js.svg" },
  { name: "JavaScript", icon: "/javascript.svg" },
  { name: "TypeScript", icon: "/Typescript.svg" },
  { name: "Tailwind CSS", icon: "/Tailwind CSS.svg" },
  { name: "Git & GitHub", icon: "/github.svg" },
  { name: "REST API", icon: "/Azios.svg" },
  { name: "SQL", icon: "/SQL Developer.svg" },
  { name: "UI/UX", icon: "/web-design.png" },
];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const statCards = [
  { value: "10+", label: "Projects Completed", icon: Code },
  { value: "1+", label: "Years of Experience", icon: Briefcase },
  { value: "Satisfied", label: "Clients", icon: Users },
  { value: "Always", label: "Learning", icon: Rocket },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Gurdeep082/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gurdeep-singh03/" },
  { label: "Email", href: "mailto:sainigurdeep082@gmail.com" },
];

const contactPhone = "+91 9034607228";
const contactEmail = "sainigurdeep082@gmail.com";

// Optimized fetch with caching and request deduplication
const requestCache = new Map<string, Promise<unknown>>();

async function fetchJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const cacheKey = url + JSON.stringify(options.method || "GET");

  // Prevent duplicate requests
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText || "Request failed");
      }

      return (await response.json()) as T;
    } finally {
      // Clear from cache after 5 seconds to allow fresh requests
      setTimeout(() => requestCache.delete(cacheKey), 5000);
    }
  })();

  requestCache.set(cacheKey, promise);
  return promise as Promise<T>;
}

export default function PortfolioHome() {
  const projectScrollRef = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [resume, setResume] = useState("");
  const [resumeName, setResumeName] = useState("resume.pdf");
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeImageIndexes, setActiveImageIndexes] = useState<
    Record<string, number>
  >({});
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState("");

  const handleContactSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const { fullName, email, message } = contactForm;
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setContactStatus("Please fill in your name, email, and message.");
      return;
    }

    try {
      await fetchJson(`${apiBase}/api/contact`, {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          company: contactForm.company.trim(),
          message: message.trim(),
        }),
      });

      const mailSubject = encodeURIComponent(
        `Portfolio inquiry from ${fullName.trim()}`,
      );
      const mailBody = encodeURIComponent(
        `Name: ${fullName.trim()}\nEmail: ${email.trim()}\nCompany: ${contactForm.company.trim() || "Not provided"}\n\nMessage:\n${message.trim()}`,
      );
      const whatsappText = encodeURIComponent(
        `Hi Gurdeep, I'm ${fullName.trim()} (${email.trim()}).\n\n${message.trim()}`,
      );

      setContactStatus(
        "Your message has been submitted. I’ll get back to you via email or WhatsApp.",
      );
      setContactForm({ fullName: "", email: "", company: "", message: "" });

      window.open(
        `https://wa.me/919034607228?text=${whatsappText}`,
        "_blank",
        "noopener,noreferrer",
      );
      window.location.href = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;
    } catch (error) {
      setContactStatus(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now. Please email or WhatsApp directly.",
      );
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadPortfolio() {
      try {
        const [projectResult, settingsResult, visitResult] = await Promise.all([
          fetchJson<Project[]>(`${apiBase}/api/projects`).catch(
            () => fallbackProjects,
          ),
          fetchJson<SettingsResponse>(`${apiBase}/api/settings`).catch(() => ({
            resume: "",
            resumeName: "resume.pdf",
          })),
          fetchJson<{ visitCount: number }>(`${apiBase}/api/visits`, {
            method: "POST",
          }).catch(() => ({ visitCount: 0 })),
        ]);

        if (ignore) return;

        if (projectResult?.length) setProjects(projectResult);
        if (settingsResult?.resume) {
          setResume(settingsResult.resume);
          setResumeName(settingsResult.resumeName || "resume.pdf");
        }
        setVisitCount(visitResult?.visitCount ?? 0);
      } catch (error) {
        if (!ignore) {
          setFetchError(
            error instanceof Error
              ? error.message
              : "Unable to load portfolio data.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPortfolio();
    return () => {
      ignore = true;
    };
  }, []);

  const projectList = useMemo(() => {
    if (projects.length === 0) return fallbackProjects;
    return projects;
  }, [projects]);

useEffect(() => {
  const interval = setInterval(() => {
    setActiveImageIndexes((current) => {
      const next = { ...current };

      projectList.forEach((project, index) => {
        const images = Array.isArray(project.images)
          ? project.images
              .map((image) => normalizeProjectImageSource(image, apiBase))
              .filter((image): image is string => Boolean(image))
          : [];

        if (images.length <= 1) return;

        const key = project._id ?? `${project.title}-${index}`;
        const currentIndex = current[key] ?? 0;

        next[key] = (currentIndex + 1) % images.length;
      });

      return next;
    });
  }, 3000);

  return () => clearInterval(interval);
}, [projectList]);
  useEffect(() => {
    const container = projectScrollRef.current;

    if (!container || projectList.length <= 1) return;

    const interval = setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      const card = container.querySelector<HTMLElement>("[data-project-card]");

      if (!card) return;

      const gap = 24; // gap-6
      const scrollAmount = card.offsetWidth + gap;

      if (container.scrollLeft >= maxScrollLeft - 5) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [projectList.length]);
  const downloadResume = resume
    ? { href: resume, download: resumeName }
    : { href: "#contact" };

  return (
    <div className="min-h-screen bg-[#edf5f1] text-[#123d3d]">
      <div className="mx-auto max-w-[1780px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-20 mb-6 rounded-[14px] border border-[#123d3d]/10 bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_8px_20px_rgba(15,23,41,0.06)] backdrop-blur-xl xl:mb-8">
          <div className="mx-auto flex max-w-[1780px] items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xl font-black tracking-tight text-[#123d3d]">
              <img
                src="/GSlogo.png"
                alt="GS Logo"
                className="h-12 w-12 rounded-full shadow-[0_8px_18px_rgba(18,61,61,0.25)]"
              />
            </div>

            <nav className="hidden items-center gap-5 text-sm text-[#2f5a5a] md:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-[#123d3d]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl border border-[#123d3d]/20 bg-[#0d3d3d] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(13,61,61,0.18)] transition hover:bg-[#123d3d]"
            >
              Let&apos;s Connect
            </a>
          </div>
        </header>

        <main>
          <section
            id="home"
            className="relative overflow-hidden rounded-[14px] border border-[#123d3d]/10 bg-[#edf7f5] px-4 pb-8 pt-8 shadow-[0_16px_40px_rgba(15,23,41,0.04)] sm:px-8 lg:px-10"
          >
            <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(18,61,61,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-[#d9f3ef] blur-2xl" />
            <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-[#dfece9] blur-2xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-xl">
                <p className="mb-4 text-lg font-medium text-[#1d5b5b]">
                  Hi, I&apos;m
                </p>
                <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[#123d3d] sm:text-5xl lg:text-[4.1rem]">
                  Gurdeep Singh
                  <span className="mt-2 block bg-gradient-to-r from-[#123d3d] via-[#2d6d6b] to-[#7ec9b5] bg-clip-text text-transparent">
                    Software Developer Engineer
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-[#466d6d] sm:text-lg">
                  I build scalable, high-performance web applications with clean
                  code and great user experiences.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-xl bg-[#123d3d] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(18,61,61,0.18)] transition hover:bg-[#0d3434]"
                  >
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-xl border border-[#123d3d]/20 bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#123d3d] transition hover:border-[#123d3d]/30 hover:bg-white"
                  >
                    Contact Me
                  </a>
                </div>

                <div className="mt-7 flex items-center gap-4">
                  {socialLinks.map((item) => {
                    const IconComponent =
                      item.label === "GitHub"
                        ? Github
                        : item.label === "LinkedIn"
                          ? Linkedin
                          : Mail;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noreferrer"
                            : undefined
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123d3d]/15 bg-white/80 text-[#123d3d] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition hover:border-[#123d3d]/30 hover:bg-[#edf7f5]"
                        aria-label={item.label}
                      >
                        <IconComponent size={18} className="text-[#123d3d]" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[660px]">
                <div className="relative overflow-hidden rounded-[14px] border border-[#123d3d]/10 bg-[#0d2e2d] p-5 shadow-[0_22px_60px_rgba(17,61,61,0.18)] backdrop-blur-sm">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>

                  <div className="rounded-[14px] border border-[#7ec9b5]/20 bg-[linear-gradient(180deg,#0a1f1f_0%,#0d2d2c_100%)] p-4 font-mono text-[0.75rem] leading-6 text-[#aef0db] shadow-inner shadow-[#021312]/40">
                    <pre className="whitespace-pre-wrap text-left">
                      {`const developer = {
   name: "Gurdeep Singh",
   role: "Software Developer Engineer",
   passion: "Building impactful solutions",
   skills: ["MERN", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS"],
   focus: "Clean Code & User Experience",
};

 function build() {
    return "Creating something awesome";
 }`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

<section
  className="
    mt-5
    overflow-hidden
    rounded-[14px]
    border
    border-[#123d3d]/10
    bg-white
    shadow-[0_4px_14px_rgba(18,61,61,0.08)]
  "
>
  <div className="grid grid-cols-2 md:grid-cols-4">
    {statCards.map((card, index) => {
      const IconComponent = card.icon;

      return (
        <div
          key={card.label}
          className={`
            flex
            items-center
            gap-4
            px-5
            py-5
            sm:px-6
            md:px-5
            lg:px-7
            ${
              index % 2 !== 0
                ? "border-l border-[#123d3d]/8"
                : ""
            }
            ${
              index >= 2
                ? "border-t border-[#123d3d]/8 md:border-t-0"
                : ""
            }
            ${
              index !== 0
                ? "md:border-l md:border-[#123d3d]/8"
                : ""
            }
          `}
        >
          {/* Icon */}
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-[15px]
              bg-[#edf7f5]
              text-[#246d68]
            "
          >
            <IconComponent
              size={25}
              strokeWidth={1.8}
            />
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div
              className="
                text-lg
                font-extrabold
                leading-none
                tracking-[-0.03em]
                text-[#10202d]
                sm:text-xl
              "
            >
              {card.value}
            </div>

            <div
              className="
                mt-1.5
                whitespace-nowrap
                text-[10px]
                font-medium
                leading-tight
                text-[#587370]
                sm:text-[11px]
              "
            >
              {card.label}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

          <section
            id="about"
            className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]"
          >
            <div className="relative overflow-hidden rounded-[14px] border border-[#123d3d]/10 bg-white p-6 text-[#123d3d] shadow-[0_8px_24px_rgba(18,61,61,0.05)] sm:p-7">
              {/* Decorative dotted pattern */}
              <div
                className="
                    pointer-events-none
                    absolute
                    bottom-5
                    right-5
                    h-28
                    w-28
                    opacity-60
                    [background-image:radial-gradient(circle,rgba(42,199,166,0.55)_2px,transparent_2px)]
                    [background-size:16px_16px]
                    "
              />

              <div className="relative z-10">
                {/* Heading */}
                <div className="mb-7">
                  <h2 className="text-[28px] font-extrabold tracking-[-0.035em] text-[#0d1d2b] sm:text-[30px]">
                    About Me
                  </h2>

                  <div className="mt-4 h-[3px] w-16 rounded-full bg-[#2ac7a6]" />
                </div>

                {/* Description */}
                <p className="max-w-[620px] text-[16px] font-medium leading-[1.85] text-[#304f5b]">
                  I&apos;m a passionate Software Developer Engineer who loves
                  turning ideas into real-world applications. I specialize in
                  the MERN stack and enjoy building clean, efficient, and
                  scalable solutions.
                </p>

                {/* Resume Button */}
                <div className="mt-8">
                  <a
                    href={downloadResume.href}
                    {...(resume ? { download: resumeName } : {})}
                    className="
                        inline-flex
                        h-[58px]
                        items-center
                        justify-center
                        gap-3
                        rounded-[14px]
                        border
                        border-[#123d3d]/10
                        bg-white
                        px-6
                        text-[16px]
                        font-bold
                        text-[#10202d]
                        shadow-[0_4px_12px_rgba(18,61,61,0.04)]
                        transition-all
                        duration-200
                        hover:-translate-y-[1px]
                        hover:bg-[#f7fbfa]
                        hover:shadow-[0_8px_20px_rgba(18,61,61,0.08)]
                        "
                  >
                    {/* Download icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    Download Resume
                  </a>
                </div>
              </div>
            </div>

            <div
              id="skills"
              className="
                rounded-[14px]
                border
                border-[#123d3d]/10
                bg-white
                p-5
                text-[#123d3d]
                shadow-[0_6px_18px_rgba(18,61,61,0.05)]
                sm:p-6
            "
            >
              {/* Heading */}
              <div className="mb-5">
                <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#10202d]">
                  Skills
                </h2>

                <div className="mt-2.5 h-[3px] w-8 rounded-full bg-[#2ac7a6]" />
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {skillItems.map((skill) => (
                  <div
                    key={skill.name}
                    className="
                        flex
                        h-[58px]
                        items-center
                        gap-3
                        rounded-[8px]
                        border
                        border-[#dfe7e7]
                        bg-white
                        px-3.5
                        transition-all
                        duration-200
                        hover:border-[#2ac7a6]/40
                        hover:bg-[#f7fbfa]
                        hover:shadow-[0_4px_12px_rgba(18,61,61,0.06)]
                        "
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="
                        h-[25px]
                        w-[25px]
                        shrink-0
                        object-contain
                    "
                    />

                    <span
                      className="
                        truncate
                        text-[13px]
                        font-semibold
                        text-[#172733]
                    "
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-2xl font-bold text-[#123d3d]">
                <span className="inline-block h-[1px] w-10 bg-[#123d3d]" />
                <span>Featured Projects</span>
              </div>
              <a
                href="https://github.com/Gurdeep082?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-[#123d3d]/15
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-[#123d3d]
                transition
                hover:border-[#123d3d]/30
                hover:bg-[#edf7f5]
                md:inline-flex
            "
              >
                View All Projects
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                  <path d="M14 4h6v6" />
                  <path d="M20 4 11 13" />
                </svg>
              </a>
            </div>

            {loading ? (
              <div className="rounded-[22px] border border-[#123d3d]/15 bg-white p-6 text-[#2d5a59]">
                Loading projects...
              </div>
            ) : fetchError ? (
              <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
                {fetchError}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{projectList.map((project, index) => {
  const projectKey = project._id ?? `${project.title}-${index}`;

  const images = Array.isArray(project.images)
    ? project.images
        .map((image) => normalizeProjectImageSource(image, apiBase))
        .filter((image): image is string => Boolean(image))
    : [];

  const activeImageIndex = activeImageIndexes[projectKey] ?? 0;

                  const fallbackImage =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

                  return (
                    <article
                      key={projectKey}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[14px]
                        border
                        border-[#123d3d]/10
                        bg-white
                        shadow-[0_10px_30px_rgba(18,61,61,0.05)]
                        transition-all
                        duration-300
                        hover:-translate-y-1.5
                        hover:border-[#2ac7a6]/30
                        hover:shadow-[0_20px_45px_rgba(18,61,61,0.10)]
                        "
                    >


                      <div className="relative h-75 overflow-hidden bg-[#eef6f4]">
                        {/* Images */}
                        {images.length > 0 ? (
                          images.map((imageSource, imageIndex) => (
<img
  key={`${projectKey}-${imageSource}-${imageIndex}`}
  src={imageSource}
  alt={`${project.title} preview ${imageIndex + 1}`}
  className={`
    absolute
    inset-0
    h-full
    w-full
    object-cover
    transition-all
    duration-700
    ease-in-out
    ${
      imageIndex === activeImageIndex
        ? "translate-x-0 scale-100 opacity-100"
        : "translate-x-full scale-105 opacity-0"
    }
  `}
/>
                          ))
                        ) : (
                          <img
                            src={fallbackImage}
                            alt={`${project.title} preview`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}

                        {/* Dark gradient */}
                        <div
                          className="
              absolute
              inset-0
              z-[1]
              bg-gradient-to-t
              from-[#0b2727]/50
              via-transparent
              to-transparent
            "
                        />

                        {/* Project number */}
                        <div
                          className="
              absolute
              left-4
              top-4
              z-10
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-white/90
              px-3
              text-xs
              font-bold
              text-[#123d3d]
              shadow-lg
              backdrop-blur-md
            "
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Category */}
                        <div
                          className="
              absolute
              right-4
              top-4
              z-10
              rounded-full
              border
              border-white/25
              bg-[#123d3d]/85
              px-3
              py-1.5
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-white
              backdrop-blur-md
            "
                        >
                          Full Stack
                        </div>

                        {/* Image indicators */}
                        {images.length > 1 && (
                          <div
                            className="
                absolute
                bottom-4
                left-4
                z-10
                flex
                items-center
                gap-1.5
              "
                          >
                            {images.map((_, imageIndex) => (
                              <button
                                key={imageIndex}
                                type="button"
                                aria-label={`Show ${project.title} image ${
                                  imageIndex + 1
                                }`}
                                onClick={() =>
                                  setActiveImageIndexes((current) => ({
                                    ...current,
                                    [projectKey]: imageIndex,
                                  }))
                                }
                                className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      imageIndex === activeImageIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/80"
                    }
                    `}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* =====================================
            CONTENT
        ====================================== */}

                      <div className="p-5 sm:p-6">
                        {/* Title */}
                        <div className="mb-3">
                          <h3
                            className="
                text-[23px]
                font-extrabold
                tracking-[-0.035em]
                text-[#10202d]
                transition-colors
                duration-200
                group-hover:text-[#16796d]
              "
                          >
                            {project.title}
                          </h3>

                          <div className="mt-2 h-[3px] w-7 rounded-full bg-[#2ac7a6]" />
                        </div>

                        {/* Description */}
                        <p
                          className="
              min-h-[76px]
              text-[14px]
              leading-6
              text-[#536b72]
            "
                        >
                          {project.description}
                        </p>

                        {/* Stack */}
                        {project.stack ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {project.stack.split(",").map((item) => (
                              <span
                                key={item}
                                className="
                      rounded-full
                      border
                      border-[#123d3d]/10
                      bg-[#f2f9f7]
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-[#28615f]
                      transition
                      group-hover:border-[#2ac7a6]/20
                    "
                              >
                                {item.trim()}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Divider */}
                        <div className="my-5 h-px bg-[#123d3d]/8" />

                        {/* Actions */}
                        <div className="flex gap-2.5">
                          <a
                            href={
                              project.demoLink || project.link || "#contact"
                            }
                            target={
                              project.demoLink || project.link
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              project.demoLink || project.link
                                ? "noreferrer"
                                : undefined
                            }
                            className="
                group/demo
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#123d3d]
                px-3
                py-3
                text-sm
                font-bold
                text-white
                transition-all
                duration-200
                hover:bg-[#0d3030]
                hover:shadow-[0_8px_18px_rgba(18,61,61,0.18)]
              "
                          >
                            Live Demo
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              {/* Rounded square */}
                              <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />

                              {/* External arrow */}
                              <path d="M14 4h6v6" />
                              <path d="M20 4 11 13" />
                            </svg>
                          </a>

                          <a
                            href={
                              project.githubLink || project.link || "#contact"
                            }
                            target={
                              project.githubLink || project.link
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              project.githubLink || project.link
                                ? "noreferrer"
                                : undefined
                            }
                            className="
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#123d3d]/15
                bg-white
                px-3
                py-3
                text-sm
                font-bold
                text-[#123d3d]
                transition-all
                duration-200
                hover:border-[#2ac7a6]/50
                hover:bg-[#f3faf8]
              "
                          >
                            GitHub
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              {/* Rounded square */}
                              <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />

                              {/* External arrow */}
                              <path d="M14 4h6v6" />
                              <path d="M20 4 11 13" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

<section
  id="experience"
  className="
    mt-8
    rounded-[14px]
    border
    border-[#123d3d]/10
    bg-white
    p-5
    text-[#123d3d]
    shadow-[0_12px_32px_rgba(18,61,61,0.06)]
    sm:p-6
  "
>
  {/* Header */}
  <div className="mb-7">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-extrabold tracking-[-0.035em] text-[#10202d]">
        Experience & Education
      </h2>

      <span className="h-[3px] w-8 rounded-full bg-[#2ac7a6]" />
    </div>

    <p className="mt-2 text-sm text-[#6b8583]">
      Professional experience and academic background.
    </p>
  </div>

  {/* Timeline */}
  <div className="relative ml-2 border-l border-[#123d3d]/10 pl-7 sm:ml-3 sm:pl-9">

    {/* =====================================
        EXPERIENCE
    ====================================== */}

    <div className="relative pb-9">
      {/* Timeline dot */}
      <span
        className="
          absolute
          -left-[38px]
          top-1
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          border-4
          border-white
          bg-[#2ac7a6]
          shadow-[0_0_0_1px_rgba(42,199,166,0.25)]
          sm:-left-[45px]
        "
      />

      {/* Experience Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2ac7a6]">
            Experience
          </p>

          <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#123d3d]">
            Software Developer Intern
          </h3>

          <p className="mt-1 text-sm font-semibold text-[#39716c]">
            Webzark Technologies
          </p>
        </div>

        <span
          className="
            w-fit
            rounded-full
            border
            border-[#2ac7a6]/20
            bg-[#edf8f5]
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#39716c]
          "
        >
          May 2026 — Present
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 max-w-3xl text-sm leading-6 text-[#607977]">
        Developing and maintaining responsive web applications using
        Next.js, React.js, and Tailwind CSS with a focus on reusable
        components, API integration, debugging, and responsive UI
        development.
      </p>

      {/* Responsibilities */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {[
          "Develop responsive web applications using Next.js and React.js.",
          "Build modern and reusable UI components using Tailwind CSS.",
          "Integrate frontend functionality with APIs and mock data.",
          "Debug UI, functional, and responsive layout issues.",
          "Work with Git and GitHub for feature development and bug fixing.",
          "Build modular components to improve maintainability.",
        ].map((item) => (
          <div
            key={item}
            className="
              flex
              items-start
              gap-2.5
              rounded-xl
              border
              border-[#123d3d]/8
              bg-[#f8fbfa]
              px-3.5
              py-3
            "
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2ac7a6]" />

            <span className="text-xs leading-5 text-[#4f6e6b]">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          "Next.js",
          "React.js",
          "Tailwind CSS",
          "REST APIs",
          "Git",
          "GitHub",
        ].map((tech) => (
          <span
            key={tech}
            className="
              rounded-full
              border
              border-[#123d3d]/10
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-[#28615f]
            "
          >
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* =====================================
        EDUCATION
    ====================================== */}

    <div className="relative pb-9">
      {/* Timeline dot */}
      <span
        className="
          absolute
          -left-[38px]
          top-1
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          border-4
          border-white
        bg-[#2ac7a6]
        shadow-[0_0_0_1px_rgba(42,199,166,0.25)]
          sm:-left-[45px]
        "
      />

      {/* Education Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2ac7a6]">
            Education
          </p>

          <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#123d3d]">
            Bachelor of Engineering
          </h3>

          <p className="mt-1 text-sm font-semibold text-[#39716c]">
            Computer Science Engineering
          </p>

          <p className="mt-1 text-sm text-[#607977]">
            Chitkara University, Punjab
          </p>
        </div>

        <span
          className="
            w-fit
            rounded-full
            border
            border-[#123d3d]/10
            bg-[#f1f7f5]
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#39716c]
          "
        >
          2022 — 2026
        </span>
      </div>

      {/* Degree details */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className="
            rounded-full
            border
            border-[#123d3d]/10
            bg-[#f8fbfa]
            px-3
            py-1.5
            text-[10px]
            font-semibold
            text-[#28615f]
          "
        >
          B.E. CSE
        </span>

        <span
          className="
            rounded-full
            border
            border-[#123d3d]/10
            bg-[#f8fbfa]
            px-3
            py-1.5
            text-[10px]
            font-semibold
            text-[#28615f]
          "
        >
          CGPA 6.57 / 10
        </span>
      </div>
    </div>

    {/* =====================================
        SENIOR SECONDARY
    ====================================== */}

    <div className="relative">
      {/* Timeline dot */}
      <span
        className="
          absolute
          -left-[38px]
          top-1
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          border-4
          border-white
          bg-[#7ec9b5]
          shadow-[0_0_0_1px_rgba(126,201,181,0.25)]
          sm:-left-[45px]
        "
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2ac7a6]">
            Education
          </p>

          <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#123d3d]">
            Senior Secondary (XII) — CBSE
          </h3>

          <p className="mt-1 text-sm font-semibold text-[#39716c]">
            Saraswati Vidya Mandir Sr. Sec. School
          </p>

          <p className="mt-1 text-sm text-[#607977]">
            Saha, Ambala
          </p>
        </div>

        <span
          className="
            w-fit
            rounded-full
            border
            border-[#123d3d]/10
            bg-[#f1f7f5]
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#39716c]
          "
        >
          2021 — 2022
        </span>
      </div>

      <div className="mt-4">
        <span
          className="
            inline-flex
            rounded-full
            border
            border-[#123d3d]/10
            bg-[#f8fbfa]
            px-3
            py-1.5
            text-[10px]
            font-semibold
            text-[#28615f]
          "
        >
          CBSE
        </span>
      </div>
    </div>
  </div>
</section>

          <section
            id="contact"
            className="
    relative
    mt-8
    overflow-hidden
    rounded-[14px]
    border
    border-[#123d3d]/10
    bg-[linear-gradient(135deg,#f8fcfb_0%,#edf7f5_50%,#ffffff_100%)]
    p-5
    text-[#123d3d]
    shadow-[0_18px_50px_rgba(18,61,61,0.07)]
    sm:p-7
    lg:p-9
  "
          >
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2ac7a6]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#123d3d]/5 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">


              <div className="flex flex-col justify-between">
                <div>
                  {/* Label */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-[2px] w-8 rounded-full bg-[#2ac7a6]" />

                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#2ac7a6]">
                      Get in touch
                    </p>
                  </div>

                  {/* Heading */}
                  <h3 className="max-w-md text-[2.5rem] font-black leading-[1.05] tracking-[-0.05em] text-[#10202d] sm:text-[3rem]">
                    Let&apos;s build
                    <span className="block text-[#123d3d]">
                      something great.
                    </span>
                  </h3>

                  <p className="mt-5 max-w-md text-[15px] leading-7 text-[#58706f]">
                    Have an idea, project, or opportunity in mind? I&apos;d love
                    to hear about it and turn it into something meaningful.
                  </p>
                </div>

                {/* Contact details */}
                <div className="mt-8 space-y-3">
                  {/* Phone */}
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="
            group
            flex
            items-center
            gap-4
            rounded-2xl
            border
            border-[#123d3d]/8
            bg-white/75
            p-3.5
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#2ac7a6]/30
            hover:bg-white
            hover:shadow-[0_8px_20px_rgba(18,61,61,0.06)]
          "
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7f5] text-[#123d3d]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78908e]">
                        Phone
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-[#123d3d]">
                        {contactPhone}
                      </p>
                    </div>

                    <span className="ml-auto text-[#7b9995] transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="
            group
            flex
            items-center
            gap-4
            rounded-2xl
            border
            border-[#123d3d]/8
            bg-white/75
            p-3.5
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#2ac7a6]/30
            hover:bg-white
            hover:shadow-[0_8px_20px_rgba(18,61,61,0.06)]
          "
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7f5] text-[#123d3d]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78908e]">
                        Email
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-[#123d3d]">
                        {contactEmail}
                      </p>
                    </div>

                    <span className="ml-auto text-[#7b9995] transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919034607228"
                    target="_blank"
                    rel="noreferrer"
                    className="
            group
            flex
            items-center
            gap-4
            rounded-2xl
            border
            border-[#123d3d]/8
            bg-white/75
            p-3.5
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#2ac7a6]/30
            hover:bg-white
            hover:shadow-[0_8px_20px_rgba(18,61,61,0.06)]
          "
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7f5] text-[#123d3d]">
                      <span className="text-lg">◔</span>
                    </span>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#78908e]">
                        WhatsApp
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#123d3d]">
                        Message directly
                      </p>
                    </div>

                    <span className="ml-auto text-[#7b9995] transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              {/* =====================================
        RIGHT — FORM
    ====================================== */}

              <form
                onSubmit={handleContactSubmit}
                className="
        rounded-[14px]
        border
        border-[#123d3d]/10
        bg-white/85
        p-5
        shadow-[0_12px_35px_rgba(18,61,61,0.06)]
        backdrop-blur-md
        sm:p-6
      "
              >
                {/* Form heading */}
                <div className="mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2ac7a6]">
                    Start a conversation
                  </p>

                  <h4 className="mt-2 text-xl font-extrabold tracking-[-0.025em] text-[#10202d]">
                    Tell me about your project
                  </h4>
                </div>

                {/* Name + Email */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-[#284b4b]">
                      Full name
                    </span>

                    <input
                      type="text"
                      value={contactForm.fullName}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          fullName: event.target.value,
                        })
                      }
                      className="
              mt-2
              h-12
              w-full
              rounded-xl
              border
              border-[#123d3d]/10
              bg-[#f8fbfa]
              px-4
              text-sm
              text-[#123d3d]
              outline-none
              transition
              placeholder:text-[#9cbcb5]
              focus:border-[#2ac7a6]
              focus:bg-white
              focus:ring-4
              focus:ring-[#2ac7a6]/10
            "
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold text-[#284b4b]">
                    Email or Phone Number
                    </span>

                    <input
                    type="text"
                    value={contactForm.email}
                    onChange={(event) =>
                        setContactForm({
                        ...contactForm,
                        email: event.target.value,
                        })
                    }
                    className="
                        mt-2
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[#123d3d]/10
                        bg-[#f8fbfa]
                        px-4
                        text-sm
                        text-[#123d3d]
                        outline-none
                        transition
                        placeholder:text-[#9cbcb5]
                        focus:border-[#2ac7a6]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#2ac7a6]/10
                    "
                    placeholder="Email address or phone number"
                    />
                  </label>
                </div>

                {/* Company */}
                <label className="mt-4 block">
                  <span className="text-xs font-bold text-[#284b4b]">
                    Company / Project
                  </span>

                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(event) =>
                      setContactForm({
                        ...contactForm,
                        company: event.target.value,
                      })
                    }
                    className="
            mt-2
            h-12
            w-full
            rounded-xl
            border
            border-[#123d3d]/10
            bg-[#f8fbfa]
            px-4
            text-sm
            text-[#123d3d]
            outline-none
            transition
            placeholder:text-[#9cbcb5]
            focus:border-[#2ac7a6]
            focus:bg-white
            focus:ring-4
            focus:ring-[#2ac7a6]/10
          "
                    placeholder="Company or project name"
                  />
                </label>

                {/* Message */}
                <label className="mt-4 block">
                  <span className="text-xs font-bold text-[#284b4b]">
                    Message
                  </span>

                  <textarea
                    value={contactForm.message}
                    onChange={(event) =>
                      setContactForm({
                        ...contactForm,
                        message: event.target.value,
                      })
                    }
                    className="
            mt-2
            min-h-[140px]
            w-full
            resize-none
            rounded-xl
            border
            border-[#123d3d]/10
            bg-[#f8fbfa]
            px-4
            py-3.5
            text-sm
            leading-6
            text-[#123d3d]
            outline-none
            transition
            placeholder:text-[#9cbcb5]
            focus:border-[#2ac7a6]
            focus:bg-white
            focus:ring-4
            focus:ring-[#2ac7a6]/10
          "
                    placeholder="Tell me about your idea, project, or opportunity..."
                  />
                </label>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="
    group
    inline-flex
    h-12
    w-full
    flex-1
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[#123d3d]
    px-5
    text-sm
    font-bold
    text-white
    shadow-[0_10px_24px_rgba(18,61,61,0.18)]
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:bg-[#0d3434]
    hover:shadow-[0_14px_28px_rgba(18,61,61,0.22)]
    sm:w-auto
    sm:h-12
  "
                  >
                    <span>Send Message</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 90 90"
                      width="17"
                      height="17"
                      fill="currentColor"
                      aria-hidden="true"
                      className="
      -translate-y-px
      font-bold
      transition-transform
      duration-200
      group-hover:translate-x-1
      group-hover:-translate-y-0.5
    "
                    >
                      <path d="M89.981 6.2C90 6.057 90.001 5.915 89.979 5.775c-.003-.021-.001-.041-.005-.062-.033-.163-.098-.317-.183-.462-.009-.016-.01-.033-.019-.049-.015-.024-.039-.036-.055-.059-.034-.048-.06-.102-.101-.146-.051-.056-.113-.097-.17-.144-.031-.025-.058-.054-.09-.076-.134-.093-.28-.164-.436-.209-.028-.008-.056-.009-.084-.015-.132-.03-.267-.041-.404-.034-.046.002-.089.006-.135.012-.039.006-.079.002-.118.01l-87 19.456c-.611.137-1.073.639-1.159 1.259-.085.62.224 1.229.775 1.525l23.523 12.661 7.327 23.36c.008.025.025.043.034.067.021.056.052.106.08.16.059.114.127.218.211.312.022.025.03.057.054.08.022.021.05.028.073.048.099.086.207.155.325.213.047.023.088.053.136.07.164.061.336.1.517.1.011 0 .022 0 .033 0 .179-.004.349-.044.509-.107.041-.016.075-.044.114-.063.127-.063.244-.139.349-.235.02-.018.046-.024.065-.044l12.009-12.209 23.18 12.477c.221.119.466.18.711.18.188 0 .378-.035.557-.107.412-.164.73-.504.869-.926L89.93 6.473c.014-.044.015-.09.025-.135.011-.046.02-.091.026-.138zM77.435 10.018L25.58 36.717 5.758 26.047l71.677-16.029zM74.32 14.997L36.813 43.768c-.003.002-.005.006-.007.008-.112.087-.209.194-.294.314-.018.025-.035.05-.051.076-.017.028-.039.052-.055.081-.054.1-.093.204-.122.309-.001.005-.005.009-.006.014L32.96 56.977l-5.586-17.809L74.32 14.997zM35.992 57.249l2.693-10.072 4.717 2.539-7.41 7.533zM69.177 60.184L40.479 44.737l45.09-34.588-16.392 50.035z" />

                      <path d="M12.9 85.482c-.38 0-.76-.144-1.052-.431-.591-.581-.599-1.53-.018-2.121l14.292-14.528c.581-.592 1.531-.598 2.121-.018.591.581.599 1.53.018 2.121L13.97 85.034c-.294.299-.682.448-1.07.448z" />

                      <path d="M36.431 79.593c-.38 0-.76-.144-1.052-.431-.591-.581-.599-1.53-.018-2.121l14.291-14.527c.582-.591 1.531-.598 2.121-.018.591.581.599 1.53.018 2.121L37.501 79.145c-.294.298-.682.448-1.07.448z" />

                      <path d="M8.435 67.229c-.38 0-.76-.144-1.052-.431-.591-.581-.599-1.53-.018-2.121l10.445-10.618c.581-.591 1.531-.598 2.121-.018.591.581.599 1.53.018 2.121L9.505 66.78c-.294.299-.682.449-1.07.449z" />
                    </svg>
                  </button>

                  <a
                    href="https://wa.me/919034607228?text=Hi%20Gurdeep%2C%20I%20want%20to%20connect%20about%20a%20project."
                    target="_blank"
                    rel="noreferrer"
                    className="
    group
    inline-flex
    h-12
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-[#123d3d]/15
    bg-white
    px-5
    text-sm
    font-bold
    text-[#123d3d]
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:border-[#2ac7a6]/50
    hover:bg-[#f3faf8]
    sm:w-auto
  "
                  >
                    {/* WhatsApp icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 90 90"
                      width="18"
                      height="18"
                      aria-hidden="true"
                      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                    >
                      <path
                        d="M2.113 44.609c-.003 7.587 1.98 14.994 5.749 21.524l-6.11 22.31 22.83-5.986c6.29 3.428 13.372 5.237 20.58 5.24h.019c23.736 0 43.056-19.315 43.066-43.053.005-11.504-4.471-22.32-12.603-30.459C67.514 6.047 56.702 1.563 45.18 1.558c-23.737 0-43.057 19.312-43.067 43.052"
                        fill="#2ab540"
                      />

                      <path
                        d="M.576 44.596C.573 52.456 2.626 60.129 6.53 66.892L.201 90l23.65-6.201c6.516 3.553 13.852 5.426 21.318 5.429h.019c24.586 0 44.601-20.009 44.612-44.597.004-11.917-4.633-23.122-13.055-31.552C68.321 4.65 57.121.005 45.188 0 20.597 0 .585 20.005.575 44.595M14.658 65.727l-.883-1.402c-3.712-5.902-5.671-12.723-5.669-19.726C8.115 24.161 24.748 7.532 45.201 7.532c9.905.004 19.213 3.865 26.215 10.871 7.001 7.006 10.854 16.32 10.851 26.224-.009 20.439-16.643 37.068-37.08 37.068h-.015c-6.655-.004-13.181-1.79-18.872-5.168l-1.355-.803-14.035 3.68 3.748-13.677z"
                        fill="#fbfbfb"
                      />

                      <path
                        d="M34.038 25.95c-.835-1.856-1.714-1.894-2.508-1.926-.65-.028-1.394-.026-2.136-.026-.744 0-1.951.279-2.972 1.394-1.022 1.116-3.902 3.812-3.902 9.296 0 5.485 3.995 10.784 4.551 11.529.558.743 7.712 12.357 19.041 16.825 9.416 3.713 11.333 2.975 13.376 2.789 2.044-.186 6.595-2.696 7.524-5.299.929-2.603.929-4.834.651-5.299-.279-.465-1.022-.744-2.137-1.301-1.115-.558-6.595-3.254-7.617-3.626-1.022-.372-1.765-.557-2.509.559-.743 1.115-2.878 3.625-3.528 4.368-.65.745-1.301.838-2.415.28-1.115-.559-4.705-1.735-8.964-5.532-3.314-2.955-5.551-6.603-6.201-7.719-.65-1.115-.069-1.718.489-2.274.501-.499 1.115-1.301 1.673-1.952.556-.651.742-1.116 1.113-1.859.372-.744.186-1.395-.093-1.953-.279-.558-2.445-6.07-3.436-8.274"
                        fill="#fbfbfb"
                      />
                    </svg>

                    <span>WhatsApp</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {/* Rounded square */}
                      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />

                      {/* External arrow */}
                      <path d="M14 4h6v6" />
                      <path d="M20 4 11 13" />
                    </svg>
                  </a>
                </div>

                {/* Status */}
                {contactStatus ? (
                  <div className="mt-4 rounded-xl border border-[#2ac7a6]/20 bg-[#edf9f6] px-4 py-3">
                    <p className="text-sm font-medium text-[#28615f]">
                      {contactStatus}
                    </p>
                  </div>
                ) : null}
              </form>
            </div>
          </section>
        </main>

        <footer
          id="contact-footer"
          className="mt-8 rounded-[14px] border border-[#123d3d]/10 bg-white px-4 py-7 text-[#123d3d] shadow-[0_8px_24px_rgba(18,61,61,0.05)] sm:px-7 sm:py-8"
        >
          <div className="grid gap-6 text-center sm:text-left sm:grid-cols-2 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] md:gap-8">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 text-xl font-black tracking-tight text-[#123d3d]">
                <img
                  src="/GSlogo.png"
                  alt="GS Logo"
                  className="h-12 w-12 rounded-full shadow-[0_8px_18px_rgba(18,61,61,0.25)]"
                />
              </div>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[#2d5a59]">
                Building digital solutions that make a difference.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#123d3d]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-[#2d5a59]">
                <li>
                  <a href="#home" className="hover:text-[#2ac7a6] transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#2ac7a6] transition">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-[#2ac7a6] transition"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-[#2ac7a6] transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#123d3d]">
                Technologies
              </h4>
              <ul className="space-y-2 text-sm text-[#2d5a59]">
                <li>React</li>
                <li>Next.js</li>
                <li>Node.js</li>
                <li>MongoDB</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#123d3d]">
                Connect
              </h4>
              <ul className="space-y-2 text-sm text-[#2d5a59]">
                <li>
                  <a
                    href="https://github.com/gurdeep082"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#2ac7a6] transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/gurdeep-singh03/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#2ac7a6] transition"
                  >
                    LinkedIn
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:sainigurdeep082@gmail.com"
                    className="hover:text-[#2ac7a6] transition"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#123d3d]/10 pt-5 text-center text-sm text-[#2d5a59] sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>© 2024 Gurdeep Singh. All rights reserved.</p>
            <p>Built with ❤ and lots of ☕</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
