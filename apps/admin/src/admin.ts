export {};

type AuthSession = { access_token: string; user?: { email?: string } };
type FeedbackItem = {
  id: string;
  issue_type: string;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  messages?: { content?: string; structured_response?: unknown } | null;
};
type ContentRow = Record<string, unknown> & { id?: string; created_at?: string };

const $ = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing admin element: ${id}`);
  return element as T;
};

const urlInput = $<HTMLInputElement>("supabase-url");
const keyInput = $<HTMLInputElement>("supabase-key");
const emailInput = $<HTMLInputElement>("admin-email");
const otpInput = $<HTMLInputElement>("otp");
const setup = $("setup");
const workspace = $("workspace");
const signOutButton = $("sign-out");
const authStatus = $("auth-status");
const otpLabel = $("otp-label");
const verifyOtpButton = $("verify-otp");
const feedbackList = $("feedback-list");
const feedbackStatus = $<HTMLSelectElement>("feedback-status");
const feedbackStatusMessage = $("feedback-status-message");
const contentList = $("content-list");
const contentResource = $<HTMLSelectElement>("content-resource");
const dashboardOutput = $("dashboard-output");
const dashboardStatus = $("dashboard-status");
const cacheList = $("cache-list");
const cacheStatus = $("cache-status");
const usersList = $("users-list");
const usersStatus = $("users-status");

const savedUrl = localStorage.getItem("dharma_admin_url") ?? "";
const savedKey = localStorage.getItem("dharma_admin_key") ?? "";
urlInput.value = savedUrl;
keyInput.value = savedKey;

let session: AuthSession | null = null;

function projectUrl(): string {
  const value = urlInput.value.trim().replace(/\/$/, "");
  if (!/^https:\/\/[^\s]+$/i.test(value)) throw new Error("Use the HTTPS Supabase project URL.");
  return value;
}

function anonKey(): string {
  const value = keyInput.value.trim();
  if (!value) throw new Error("Enter the publishable anon key.");
  return value;
}

function showMessage(
  element: HTMLElement,
  message: string,
  kind: "muted" | "error" | "success" = "muted",
): void {
  element.textContent = message;
  element.className = kind;
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!session) throw new Error("Sign in as an administrator first.");
  const headers = new Headers(init.headers);
  headers.set("apikey", anonKey());
  headers.set("authorization", `Bearer ${session.access_token}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetch(`${projectUrl()}${path}`, { ...init, headers });
  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  } & T;
  if (!response.ok)
    throw new Error(body.error ?? body.message ?? `Request failed (${response.status}).`);
  return body;
}

async function sendOtp(): Promise<void> {
  try {
    const email = emailInput.value.trim();
    if (!email || !email.includes("@")) throw new Error("Enter a valid admin email.");
    const response = await fetch(`${projectUrl()}/auth/v1/otp`, {
      method: "POST",
      headers: { apikey: anonKey(), "content-type": "application/json" },
      body: JSON.stringify({ email, create_user: false }),
    });
    if (!response.ok) throw new Error("The sign-in code could not be sent.");
    localStorage.setItem("dharma_admin_url", projectUrl());
    localStorage.setItem("dharma_admin_key", anonKey());
    otpLabel.classList.remove("hidden");
    verifyOtpButton.classList.remove("hidden");
    showMessage(authStatus, "Code sent. Check the admin inbox.", "success");
  } catch (error) {
    showMessage(authStatus, errorMessage(error), "error");
  }
}

async function verifyOtp(): Promise<void> {
  try {
    const response = await fetch(`${projectUrl()}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: anonKey(), "content-type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        token: otpInput.value.trim(),
        type: "email",
      }),
    });
    const body = (await response.json()) as AuthSession & { error_description?: string };
    if (!response.ok || !body.access_token)
      throw new Error(body.error_description ?? "The code was not accepted.");
    session = body;
    setup.classList.add("hidden");
    workspace.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    showMessage(dashboardStatus, "Signed in. Loading dashboard…");
    await loadDashboard();
  } catch (error) {
    showMessage(authStatus, errorMessage(error), "error");
  }
}

async function loadFeedback(): Promise<void> {
  try {
    const body = await supabaseFetch<{ items: FeedbackItem[] }>(
      `/functions/v1/admin-feedback?status=${encodeURIComponent(feedbackStatus.value)}`,
    );
    feedbackList.replaceChildren(...body.items.map(renderFeedback));
    showMessage(
      feedbackStatusMessage,
      `${body.items.length} item${body.items.length === 1 ? "" : "s"}.`,
    );
  } catch (error) {
    showMessage(feedbackStatusMessage, errorMessage(error), "error");
  }
}

async function loadDashboard(): Promise<void> {
  try {
    const body = await supabaseFetch<Record<string, unknown>>(
      "/functions/v1/admin-ops?resource=overview",
    );
    dashboardOutput.textContent = JSON.stringify(body, null, 2);
    showMessage(dashboardStatus, "Operational metrics refreshed.", "success");
  } catch (error) {
    showMessage(dashboardStatus, errorMessage(error), "error");
  }
}

async function loadCache(): Promise<void> {
  try {
    const body = await supabaseFetch<{
      items: Array<{
        question_hash: string;
        hit_count: number;
        last_used_at: string;
        expires_at: string | null;
      }>;
      raw_questions_excluded: boolean;
    }>("/functions/v1/admin-ops?resource=cache&limit=100");
    cacheList.replaceChildren(...body.items.map(renderCacheItem));
    showMessage(cacheStatus, `${body.items.length} cache entries. Raw questions are excluded.`);
  } catch (error) {
    showMessage(cacheStatus, errorMessage(error), "error");
  }
}

function renderCacheItem(item: {
  question_hash: string;
  hit_count: number;
  last_used_at: string;
  expires_at: string | null;
}): HTMLElement {
  const article = document.createElement("article");
  const heading = document.createElement("h3");
  heading.textContent = `${item.question_hash.slice(0, 16)}… · ${item.hit_count} hits`;
  const detail = document.createElement("p");
  detail.className = "muted";
  detail.textContent = `Last used ${new Date(item.last_used_at).toLocaleString()} · expires ${item.expires_at ? new Date(item.expires_at).toLocaleString() : "unknown"}`;
  const invalidate = document.createElement("button");
  invalidate.className = "danger";
  invalidate.textContent = "Invalidate";
  invalidate.addEventListener("click", () => void invalidateCache(item.question_hash));
  article.append(heading, detail, invalidate);
  return article;
}

async function invalidateCache(questionHash: string): Promise<void> {
  if (!window.confirm("Invalidate this cached answer?")) return;
  try {
    await supabaseFetch(
      `/functions/v1/admin-ops?resource=cache&question_hash=${encodeURIComponent(questionHash)}&confirm=INVALIDATE`,
      { method: "DELETE" },
    );
    await loadCache();
  } catch (error) {
    showMessage(cacheStatus, errorMessage(error), "error");
  }
}

async function loadUsers(): Promise<void> {
  try {
    const body = await supabaseFetch<{
      items: Array<{
        id: string;
        display_name: string | null;
        timezone: string;
        created_at: string;
        quota: { plan: string; ai_messages_count: number } | null;
      }>;
      emails_excluded: boolean;
    }>("/functions/v1/admin-ops?resource=users&limit=100");
    usersList.replaceChildren(...body.items.map(renderUserItem));
    showMessage(usersStatus, `${body.items.length} users. Email addresses are excluded.`);
  } catch (error) {
    showMessage(usersStatus, errorMessage(error), "error");
  }
}

function renderUserItem(item: {
  id: string;
  display_name: string | null;
  timezone: string;
  created_at: string;
  quota: { plan: string; ai_messages_count: number } | null;
}): HTMLElement {
  const article = document.createElement("article");
  const heading = document.createElement("h3");
  heading.textContent = item.display_name?.trim() || "Unnamed user";
  const detail = document.createElement("p");
  detail.className = "muted";
  detail.textContent = `${item.id} · ${item.timezone} · joined ${new Date(item.created_at).toLocaleDateString()} · plan ${item.quota?.plan ?? "free"}`;
  article.append(heading, detail);
  return article;
}

function renderFeedback(item: FeedbackItem): HTMLElement {
  const article = document.createElement("article");
  const title = document.createElement("h3");
  title.textContent = `${item.issue_type} · ${new Date(item.created_at).toLocaleString()}`;
  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = item.status;
  const details = document.createElement("p");
  details.textContent = item.notes ?? "No user note.";
  const answer = document.createElement("pre");
  answer.textContent = item.messages?.content ?? "No answer content recorded.";
  const notes = document.createElement("textarea");
  notes.value = item.admin_notes ?? "";
  notes.setAttribute("aria-label", "Admin notes");
  const actions = document.createElement("div");
  actions.className = "actions";
  for (const status of ["pending", "reviewed", "fixed"]) {
    const button = document.createElement("button");
    button.textContent = `Mark ${status}`;
    button.className = status === "fixed" ? "secondary" : "";
    button.addEventListener("click", () => void updateFeedback(item.id, status, notes.value));
    actions.append(button);
  }
  article.append(title, pill, details, answer, notes, actions);
  return article;
}

async function updateFeedback(id: string, status: string, adminNotes: string): Promise<void> {
  try {
    await supabaseFetch("/functions/v1/admin-feedback", {
      method: "PATCH",
      body: JSON.stringify({ feedback_id: id, status, admin_notes: adminNotes }),
    });
    await loadFeedback();
  } catch (error) {
    showMessage(feedbackStatusMessage, errorMessage(error), "error");
  }
}

async function loadContent(): Promise<void> {
  try {
    const body = await supabaseFetch<{ rows: ContentRow[] }>(
      `/functions/v1/admin-content?resource=${encodeURIComponent(contentResource.value)}&limit=100`,
    );
    contentList.replaceChildren(...body.rows.map(renderContent));
  } catch (error) {
    contentList.replaceChildren(messageArticle(errorMessage(error), "error"));
  }
}

function renderContent(row: ContentRow): HTMLElement {
  const article = document.createElement("article");
  const heading = document.createElement("h3");
  heading.textContent =
    displayValue(row.title ?? row.name ?? row.term ?? row.slug ?? row.id) ?? "Content row";
  const editor = document.createElement("textarea");
  editor.value = JSON.stringify(row, null, 2);
  editor.setAttribute("aria-label", "Content JSON");
  const actions = document.createElement("div");
  actions.className = "actions";
  const save = document.createElement("button");
  save.textContent = "Save changes";
  save.addEventListener("click", () => void saveContent(row.id, editor.value));
  const remove = document.createElement("button");
  remove.textContent = "Delete";
  remove.className = "danger";
  remove.disabled = !row.id;
  remove.addEventListener("click", () => void deleteContent(row.id));
  actions.append(save, remove);
  article.append(heading, editor, actions);
  return article;
}

async function saveContent(id: string | undefined, raw: string): Promise<void> {
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    const path = id
      ? `/functions/v1/admin-content?resource=${encodeURIComponent(contentResource.value)}&id=${encodeURIComponent(id)}`
      : `/functions/v1/admin-content?resource=${encodeURIComponent(contentResource.value)}`;
    await supabaseFetch(path, { method: id ? "PATCH" : "POST", body: JSON.stringify(value) });
    await loadContent();
  } catch (error) {
    contentList.prepend(messageArticle(errorMessage(error), "error"));
  }
}

async function deleteContent(id: string | undefined): Promise<void> {
  if (!id || !window.confirm("Delete this content row? This cannot be undone from the console."))
    return;
  try {
    await supabaseFetch(
      `/functions/v1/admin-content?resource=${encodeURIComponent(contentResource.value)}&id=${encodeURIComponent(id)}&confirm=DELETE`,
      { method: "DELETE" },
    );
    await loadContent();
  } catch (error) {
    contentList.prepend(messageArticle(errorMessage(error), "error"));
  }
}

function messageArticle(message: string, kind: "error" | "muted"): HTMLElement {
  const article = document.createElement("article");
  article.className = kind;
  article.textContent = message;
  return article;
}

function displayValue(value: unknown): string | undefined {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected admin console error.";
}

$("send-otp").addEventListener("click", () => void sendOtp());
verifyOtpButton.addEventListener("click", () => void verifyOtp());
$("load-feedback").addEventListener("click", () => void loadFeedback());
feedbackStatus.addEventListener("change", () => void loadFeedback());
$("load-content").addEventListener("click", () => void loadContent());
contentResource.addEventListener("change", () => void loadContent());
$("new-content").addEventListener("click", () => contentList.prepend(renderContent({})));
$("load-dashboard").addEventListener("click", () => void loadDashboard());
$("load-cache").addEventListener("click", () => void loadCache());
$("load-users").addEventListener("click", () => void loadUsers());
signOutButton.addEventListener("click", () => {
  session = null;
  setup.classList.remove("hidden");
  workspace.classList.add("hidden");
  signOutButton.classList.add("hidden");
  feedbackList.replaceChildren();
  contentList.replaceChildren();
  dashboardOutput.textContent = "Sign in to load operational metrics.";
  cacheList.replaceChildren();
  usersList.replaceChildren();
  showMessage(authStatus, "Signed out.");
});

for (const tab of document.querySelectorAll<HTMLButtonElement>("nav button[data-tab]")) {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.tab ?? "dashboard";
    for (const button of document.querySelectorAll<HTMLButtonElement>("nav button[data-tab]"))
      button.setAttribute("aria-selected", String(button === tab));
    for (const panel of ["dashboard", "feedback", "content", "cache", "users"])
      $(`${panel}-panel`).classList.toggle("hidden", panel !== selected);
    if (selected === "dashboard") void loadDashboard();
    if (selected === "feedback") void loadFeedback();
    if (selected === "content") void loadContent();
    if (selected === "cache") void loadCache();
    if (selected === "users") void loadUsers();
  });
}
