import { supabase } from "./supabase";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
  latestQuestion: string | null;
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  summary: string | null;
  sourceCount: number;
  sourceTitles: string[];
  confidence: "low" | "medium" | "high" | null;
  traditionNotes: string[];
  safetyNote: string | null;
};

export type SavedMessage = {
  id: string;
  conversationId: string;
  content: string;
  summary: string | null;
  createdAt: string;
};

export async function loadConversations(): Promise<ConversationSummary[]> {
  if (!supabase) return [];
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id,title,updated_at")
    .order("updated_at", { ascending: false })
    .limit(30);
  if (error) throw error;

  const rows = (conversations ?? []) as Array<{
    id: string;
    title: string | null;
    updated_at: string;
  }>;
  if (!rows.length) return [];

  const { data: messages, error: messageError } = await supabase
    .from("messages")
    .select("conversation_id,role,content,created_at")
    .in(
      "conversation_id",
      rows.map((row) => row.id),
    )
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (messageError) throw messageError;

  const latestQuestionByConversation = new Map<string, string>();
  for (const message of (messages ?? []) as Array<{
    conversation_id: string;
    content: string;
  }>) {
    if (!latestQuestionByConversation.has(message.conversation_id)) {
      latestQuestionByConversation.set(message.conversation_id, message.content);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title?.trim() || "Dharma question",
    updatedAt: row.updated_at,
    latestQuestion: latestQuestionByConversation.get(row.id) ?? null,
  }));
}

export async function loadConversationMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  if (!supabase || !UUID_PATTERN.test(conversationId)) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("id,role,content,created_at,structured_response")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (
    (data ?? []) as Array<{
      id: string;
      role: string;
      content: string;
      created_at: string;
      structured_response: unknown;
    }>
  ).flatMap((message) => {
    if (message.role !== "user" && message.role !== "assistant") return [];
    const response =
      message.structured_response && typeof message.structured_response === "object"
        ? (message.structured_response as {
            summary?: unknown;
            sources?: unknown;
            confidence?: unknown;
            tradition_notes?: unknown;
            safety_note?: unknown;
          })
        : null;
    const sourceTitles = Array.isArray(response?.sources)
      ? response.sources
          .flatMap((source) => {
            if (!source || typeof source !== "object") return [];
            const title = (source as { title?: unknown }).title;
            return typeof title === "string" && title.trim() ? [title] : [];
          })
          .slice(0, 4)
      : [];
    const confidence =
      response &&
      (response.confidence === "low" ||
        response.confidence === "medium" ||
        response.confidence === "high")
        ? response.confidence
        : null;
    return [
      {
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.created_at,
        summary: typeof response?.summary === "string" ? response.summary : null,
        sourceCount: Array.isArray(response?.sources) ? response.sources.length : 0,
        sourceTitles,
        confidence,
        traditionNotes: Array.isArray(response?.tradition_notes)
          ? response.tradition_notes.filter(
              (note): note is string => typeof note === "string" && note.trim().length > 0,
            )
          : [],
        safetyNote: typeof response?.safety_note === "string" ? response.safety_note : null,
      } satisfies ConversationMessage,
    ];
  });
}

export async function loadSavedMessages(): Promise<SavedMessage[]> {
  if (!supabase) return [];
  const { data: savedRows, error: savedError } = await supabase
    .from("saved_items")
    .select("item_id,created_at")
    .eq("item_type", "message")
    .order("created_at", { ascending: false })
    .limit(100);
  if (savedError) throw savedError;

  const saved = (savedRows ?? []) as Array<{ item_id: string; created_at: string }>;
  const messageIds = saved.map((row) => row.item_id).filter((id) => UUID_PATTERN.test(id));
  if (!messageIds.length) return [];

  const { data: messages, error: messageError } = await supabase
    .from("messages")
    .select("id,conversation_id,content,created_at,structured_response,role")
    .in("id", messageIds)
    .eq("role", "assistant");
  if (messageError) throw messageError;

  const byId = new Map(
    (
      (messages ?? []) as Array<{
        id: string;
        conversation_id: string;
        content: string;
        created_at: string;
        structured_response: unknown;
        role: string;
      }>
    ).map((message) => {
      const response =
        message.structured_response && typeof message.structured_response === "object"
          ? (message.structured_response as { summary?: unknown })
          : null;
      return [
        message.id,
        {
          id: message.id,
          conversationId: message.conversation_id,
          content: message.content,
          summary: typeof response?.summary === "string" ? response.summary : null,
          createdAt: message.created_at,
        } satisfies SavedMessage,
      ] as const;
    }),
  );

  return messageIds.flatMap((id) => {
    const message = byId.get(id);
    return message ? [message] : [];
  });
}
