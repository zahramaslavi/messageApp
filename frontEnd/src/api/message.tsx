import { generalApiClient } from "./apiClient";

export const fetchUsers = async () => {
  try {
    const res = await generalApiClient("/users");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const fetchMessages = async (id: string) => {
  try {
    const res = await generalApiClient(`/users/${id}/messages`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const sendMessage = async (text: string, senderId: string, receiverId: string) => {
  try {
    const res = await generalApiClient.post(`/users/${senderId}/messages`, {text, receiverId});
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const sendLastSeen = async (userId: string, messageId: string) => {
  try {
    const res = await generalApiClient.post(`/users/${userId}/lastRead`, {messageId});
    return res.data;
  } catch (error) {
    throw error;
  }
}
