import { generalApiClient } from "./apiClient";

export const fetchUsers = async () => {
  try {
    const res = await generalApiClient("/users");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const fetchMessages = async (id: number) => {
  try {
    const res = await generalApiClient(`/users/${id}/messages`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const sendMessage = async (id: number, text: string, receiverId: number) => {
  try {
    const res = await generalApiClient.post(`/users/${id}/messages`, {text, receiverId});
    return res.data;
  } catch (error) {
    throw error;
  }
}
