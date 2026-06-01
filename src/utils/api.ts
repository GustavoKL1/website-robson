/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Lead, BlogPost, AppSettings } from "../types";

const API_BASE = "/api";

const authFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

export interface AdminSession {
  authenticated: boolean;
  configured: boolean;
  username?: string;
  totpRequired?: boolean;
}

export async function checkAdminSession(): Promise<AdminSession> {
  try {
    const res = await fetch(`${API_BASE}/admin/me`, { credentials: "include" });
    if (!res.ok) return { authenticated: false, configured: true };
    return await res.json();
  } catch {
    return { authenticated: false, configured: false };
  }
}

export async function adminLogin(
  username: string,
  password: string,
  totp?: string
): Promise<{ success: boolean; error?: string; totpRequired?: boolean }> {
  const res = await authFetch(`${API_BASE}/admin/login`, {
    method: "POST",
    body: JSON.stringify({ username, password, totp: totp || undefined }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      error: data.error || "Falha na autenticação.",
      totpRequired: data.totpRequired,
    };
  }
  return { success: true, totpRequired: data.totpRequired };
}

export async function adminLogout(): Promise<void> {
  await authFetch(`${API_BASE}/admin/logout`, { method: "POST" });
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Erro ao buscar projetos");
    return await res.json();
  } catch (err) {
    console.error("API Error in fetchProjects:", err);
    return [];
  }
}

export async function createProject(project: Omit<Project, "id">): Promise<Project | null> {
  try {
    const res = await authFetch(`${API_BASE}/projects`, {
      method: "POST",
      body: JSON.stringify(project),
    });
    if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
    if (!res.ok) throw new Error("Erro ao criar projeto");
    return await res.json();
  } catch (err) {
    console.error("API Error in createProject:", err);
    return null;
  }
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
  try {
    const res = await authFetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
    if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
    if (!res.ok) throw new Error("Erro ao atualizar projeto");
    return await res.json();
  } catch (err) {
    console.error("API Error in updateProject:", err);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const res = await authFetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
    });
    if (res.status === 401) return false;
    return res.ok;
  } catch (err) {
    console.error("API Error in deleteProject:", err);
    return false;
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const res = await authFetch(`${API_BASE}/leads`);
    if (res.status === 401) throw new Error("Não autenticado");
    if (!res.ok) throw new Error("Erro ao buscar contatos/orçamentos");
    return await res.json();
  } catch (err) {
    console.error("API Error in fetchLeads:", err);
    return [];
  }
}

interface SubmitLeadResult {
  success: boolean;
  lead?: Lead;
  emailSent?: boolean;
  emailError?: string;
  error?: string;
}

export async function submitLead(lead: Omit<Lead, "id" | "status" | "createdAt">): Promise<SubmitLeadResult> {
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Erro desconhecido ao enviar formulário" };
    }
    return {
      success: true,
      lead: data.lead,
      emailSent: data.emailSent,
      emailError: data.emailError,
    };
  } catch (err) {
    console.error("API Error in submitLead:", err);
    return { success: false, error: "Servidor offline ou sem conexão. Tente novamente mais tarde." };
  }
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  try {
    const res = await authFetch(`${API_BASE}/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) throw new Error("Não autenticado");
    if (!res.ok) throw new Error("Erro ao atualizar status");
    return await res.json();
  } catch (err) {
    console.error("API Error in updateLeadStatus:", err);
    return null;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    const res = await authFetch(`${API_BASE}/leads/${id}`, {
      method: "DELETE",
    });
    if (res.status === 401) return false;
    return res.ok;
  } catch (err) {
    console.error("API Error in deleteLead:", err);
    return false;
  }
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error("Erro ao buscar publicações");
    return await res.json();
  } catch (err) {
    console.error("API Error in fetchBlogs:", err);
    return [];
  }
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "date">): Promise<BlogPost | null> {
  try {
    const res = await authFetch(`${API_BASE}/blogs`, {
      method: "POST",
      body: JSON.stringify(post),
    });
    if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
    if (!res.ok) throw new Error("Erro ao criar post de blog");
    return await res.json();
  } catch (err) {
    console.error("API Error in createBlogPost:", err);
    return null;
  }
}

export async function fetchSettings(): Promise<AppSettings | null> {
  try {
    const res = await authFetch(`${API_BASE}/settings`);
    if (res.status === 401) return null;
    if (!res.ok) throw new Error("Erro ao carregar configurações");
    return await res.json();
  } catch (err) {
    console.error("API Error in fetchSettings:", err);
    return null;
  }
}

export async function saveSettings(settings: AppSettings): Promise<boolean> {
  try {
    const res = await authFetch(`${API_BASE}/settings`, {
      method: "POST",
      body: JSON.stringify(settings),
    });
    if (res.status === 401) return false;
    return res.ok;
  } catch (err) {
    console.error("API Error in saveSettings:", err);
    return false;
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Erro ao consultar o assistente de inteligência artificial.");
    }
    const data = await res.json();
    return data.text || "";
  } catch (err: unknown) {
    console.error("Erro em sendChatMessage:", err);
    throw err;
  }
}
