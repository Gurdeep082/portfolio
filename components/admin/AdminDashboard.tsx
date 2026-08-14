"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

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

type ContactMessage = {
  _id?: string;
  fullName: string;
  email: string;
  company?: string;
  message: string;
  createdAt?: string;
};

type DashboardData = {
  projects: Project[];
  messages: ContactMessage[];
  settings: {
    resume: string;
    resumeName: string;
    visitCount: number;
  };
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJson<T>(url: string, options: RequestInit = {}, adminKey?: string): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (adminKey) headers.set("x-admin-key", adminKey);
  if (options.body && !(headers.has("Content-Type"))) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText || "Request failed");
  }

  return (await response.json()) as T;
}

const defaultProjectForm = {
  title: "",
  description: "",
  stack: "",
  demoLink: "",
  githubLink: "",
  images: "",
};

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData>({
    projects: [],
    messages: [],
    settings: { resume: "", resumeName: "resume.pdf", visitCount: 0 },
  });
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("Connect to the server and manage your portfolio.");
  const [isBusy, setIsBusy] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("resume.pdf");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedKey = window.localStorage.getItem("portfolio_admin_key") || "";
    setAdminKey(savedKey);
    if (savedKey) setIsLoggedIn(true);
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminKey.trim()) {
      setStatus("Please enter your admin key.");
      return;
    }

    try {
      setIsBusy(true);
      const saved = await fetchJson<{ ok?: boolean; message?: string }>(`${apiBase}/api/health`, {}, adminKey);
      setStatus(saved?.message || "Admin access ready. Loading dashboard...");
      window.localStorage.setItem("portfolio_admin_key", adminKey.trim());
      setIsLoggedIn(true);
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invalid admin key.");
    } finally {
      setIsBusy(false);
    }
  };

  const loadDashboard = async () => {
    if (!adminKey.trim()) return;
    try {
      setIsBusy(true);
      const data = await fetchJson<DashboardData>(`${apiBase}/api/admin/dashboard`, {}, adminKey);
      setDashboard(data);
      setResumeFileName(data.settings.resumeName || "resume.pdf");
      setStatus("Dashboard updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load dashboard data.");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !adminKey.trim()) return;
    loadDashboard();
  }, [isLoggedIn, adminKey]);

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setStatus("Project title and description are required.");
      return;
    }

    const images = projectForm.images
      .split(/\n|,/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (!images.length) {
      setStatus("Provide at least one project image URL.");
      return;
    }

    try {
      setIsBusy(true);
      const demoLink = projectForm.demoLink.trim();
      const githubLink = projectForm.githubLink.trim();

      if (!demoLink || !githubLink) {
        setStatus("Both the live demo link and GitHub link are required.");
        return;
      }

      const payload = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        stack: projectForm.stack.trim(),
        demoLink,
        githubLink,
        link: demoLink,
        images,
      };

      if (editingId) {
        await fetchJson(`${apiBase}/api/admin/projects/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }, adminKey);
        setStatus("Project updated successfully.");
      } else {
        await fetchJson(`${apiBase}/api/admin/projects`, {
          method: "POST",
          body: JSON.stringify(payload),
        }, adminKey);
        setStatus("Project created successfully.");
      }

      setProjectForm(defaultProjectForm);
      setEditingId(null);
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save project.");
    } finally {
      setIsBusy(false);
    }
  };

  const editProject = (project: Project) => {
    setEditingId(project._id || null);
    setProjectForm({
      title: project.title,
      description: project.description,
      stack: project.stack || "",
      demoLink: project.demoLink || project.link || "",
      githubLink: project.githubLink || "",
      images: (project.images || []).join("\n"),
    });
  };

  const deleteProject = async (projectId?: string) => {
    if (!projectId) return;
    try {
      setIsBusy(true);
      await fetchJson(`${apiBase}/api/admin/projects/${projectId}`, { method: "DELETE" }, adminKey);
      setStatus("Project removed.");
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Removal failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const resetVisits = async () => {
    try {
      setIsBusy(true);
      const result = await fetchJson<{ message: string; visitCount: number }>(`${apiBase}/api/admin/reset-visits`, { method: "PUT" }, adminKey);
      setStatus(result.message || "Visit count reset.");
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Visit reset failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const uploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("Please upload a PDF resume.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = String(reader.result || "");
        if (!dataUrl.startsWith("data:application/pdf")) {
          setStatus("The selected file is not a valid PDF.");
          return;
        }

        setIsBusy(true);
        const result = await fetchJson<{ message: string; resumeName: string }>(`${apiBase}/api/admin/resume`, {
          method: "PUT",
          body: JSON.stringify({ resume: dataUrl, resumeName: file.name }),
        }, adminKey);

        setStatus(result.message || "Resume uploaded successfully.");
        setResumeFileName(result.resumeName || file.name);
        await loadDashboard();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Resume upload failed.");
      } finally {
        setIsBusy(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const deleteMessage = async (messageId?: string) => {
    if (!messageId) return;
    try {
      setIsBusy(true);
      await fetchJson(`${apiBase}/api/admin/messages/${messageId}`, { method: "DELETE" }, adminKey);
      setStatus("Message deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Message deletion failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const totalVisitCount = useMemo(() => dashboard.settings.visitCount || 0, [dashboard.settings.visitCount]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020b1d] px-4 py-10 text-white">
        <div className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-[#071425] p-6 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl font-black">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#123d3d] to-[#7ec9b5] text-sm text-white">
                GS
              </span>
              Admin
            </div>
            <Link href="/" className="text-sm text-[#7ec9b5] hover:text-[#8dd9c7]">
              Back home
            </Link>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label htmlFor="admin-key" className="mb-2 block text-sm font-medium text-slate-200">
                Admin key
              </label>
              <input
                id="admin-key"
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                className="w-full rounded-xl border border-[#123d3d]/20 bg-slate-950/60 px-3 py-3 text-white outline-none ring-0 placeholder:text-[#a9d6d0] focus:border-[#7ec9b5]"
                placeholder="Enter your admin secret"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#123d3d] to-[#2d6d6b] px-4 py-3 font-semibold text-white shadow-lg shadow-[#123d3d]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isBusy ? "Checking access..." : "Open dashboard"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-400">{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#123d3d] to-[#7ec9b5] text-sm font-black text-white">
              GS
            </div>
            <div>
              <p className="text-sm text-slate-500">Portfolio dashboard</p>
              <h1 className="text-xl font-black">Admin control center</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-lg border border-[#123d3d]/15 px-3 py-2 text-sm font-medium text-[#123d3d] hover:border-[#7ec9b5] hover:text-[#2d6d6b]">
              View site
            </Link>
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem("portfolio_admin_key");
                setAdminKey("");
                setIsLoggedIn(false);
                setStatus("Signed out safely.");
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Visits</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-black">{totalVisitCount}</span>
              <button type="button" onClick={resetVisits} className="text-xs font-semibold text-[#2d6d6b]">
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Projects</p>
            <span className="mt-2 block text-3xl font-black">{dashboard.projects.length}</span>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Messages</p>
            <span className="mt-2 block text-3xl font-black">{dashboard.messages.length}</span>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Resume</p>
            <span className="mt-2 block truncate text-sm font-semibold text-slate-700">{dashboard.settings.resumeName || "Not uploaded"}</span>
          </div>
        </section>

        <div className="mb-5 rounded-[16px] border border-[#123d3d]/20 bg-[#f0f9f8] px-4 py-3 text-sm text-[#2d6d6b]">
          {status}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Project manager</h2>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(null); setProjectForm(defaultProjectForm); }} className="text-sm font-medium text-slate-500">
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form onSubmit={saveProject} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
                  className="w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
                  className="min-h-[100px] w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="Project summary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">Stack</label>
                <input
                  type="text"
                  value={projectForm.stack}
                  onChange={(event) => setProjectForm({ ...projectForm, stack: event.target.value })}
                  className="w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="React, Next.js, Firebase"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">Live demo link</label>
                <input
                  type="url"
                  value={projectForm.demoLink}
                  onChange={(event) => setProjectForm({ ...projectForm, demoLink: event.target.value })}
                  className="w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">GitHub link</label>
                <input
                  type="url"
                  value={projectForm.githubLink}
                  onChange={(event) => setProjectForm({ ...projectForm, githubLink: event.target.value })}
                  className="w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#123d3d]">Project images (one URL per line)</label>
                <textarea
                  value={projectForm.images}
                  onChange={(event) => setProjectForm({ ...projectForm, images: event.target.value })}
                  className="min-h-[120px] w-full rounded-xl border border-[#123d3d]/15 bg-[#f8fbfa] px-3 py-2.5 outline-none focus:border-[#7ec9b5]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#123d3d] to-[#2d6d6b] px-4 py-3 font-semibold text-white shadow-lg shadow-[#123d3d]/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBusy ? "Saving..." : editingId ? "Update project" : "Add project"}
              </button>
            </form>
          </section>

          <section className="space-y-5">
            <div className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-xl font-black">Resume upload</h2>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7ec9b5] bg-[#f0f9f8] px-4 py-6 text-center">
                <span className="text-lg font-bold text-[#2d6d6b]">Upload PDF resume</span>
                <span className="mt-1 text-sm text-[#7ec9b5]">{resumeFileName}</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={uploadResume} />
              </label>
            </div>

            <div className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-xl font-black">Recent messages</h2>
              <div className="space-y-3">
                {dashboard.messages.length ? (
                  dashboard.messages.slice(0, 4).map((message) => (
                    <div key={message._id || message.email} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-800">{message.fullName}</p>
                        <button type="button" onClick={() => deleteMessage(message._id)} className="text-xs font-semibold text-rose-500">
                          Delete
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{message.email}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{message.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No messages received yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Current projects</h2>
          </div>

          <div className="space-y-3">
            {dashboard.projects.length ? (
              dashboard.projects.map((project) => (
                <div key={project._id || project.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{project.title}</p>
                    <p className="text-sm text-slate-600">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editProject(project)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteProject(project._id)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No projects uploaded yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
