export type MessageRole = "user" | "assistant" | "tool" | "system";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  role: MessageRole;
  tool_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface CreateChatPayload {
  title: string;
}

export interface UpdateChatPayload {
  title?: string | null;
}

export interface CreateMessagePayload {
  content: string;
}
