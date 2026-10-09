import { api } from "@/lib/api";
import type {
  Chat,
  ChatWithMessages,
  CreateChatPayload,
  CreateMessagePayload,
  Message,
  UpdateChatPayload,
} from "@/lib/types";

export async function getChats(): Promise<Chat[]> {
  const { data } = await api.get<Chat[]>("/api/chats");
  return data;
}

export async function createChat(payload: CreateChatPayload): Promise<Chat> {
  const { data } = await api.post<Chat>("/api/chats", payload);
  return data;
}

export async function getChat(chatId: string): Promise<ChatWithMessages> {
  const { data } = await api.get<ChatWithMessages>(`/api/chats/${chatId}`);
  return data;
}

export async function updateChat(
  chatId: string,
  payload: UpdateChatPayload,
): Promise<Chat> {
  const { data } = await api.patch<Chat>(`/api/chats/${chatId}`, payload);
  return data;
}

export async function deleteChat(chatId: string): Promise<void> {
  await api.delete(`/api/chats/${chatId}`);
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const { data } = await api.get<Message[]>(`/api/messages/${chatId}`);
  return data;
}

export async function sendMessage(
  chatId: string,
  payload: CreateMessagePayload,
): Promise<Message[]> {
  const { data } = await api.post<Message[]>(
    `/api/messages/${chatId}`,
    payload,
  );
  return data;
}
