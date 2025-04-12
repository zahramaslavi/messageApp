import { MessageI } from "./message";
import { UserI } from "./user";


export interface MessageInitStateI {
  users: UserI[],
  currentChatUserFrom: UserI | null,
  currentChatUserTo: UserI | null,
  currentChatMessages: MessageI[],
  currentChatLastSeen: string | null,
  errorStatus: null | number,
  errorMessage: null | String,
}

export interface MessageContextI {
  messageState: MessageInitStateI,
  addMessage: (text: string) => void,
  selectCurrentChat: (userFrom: UserI, userTo: UserI) => void,
  getCurrentChatMessages: () => void,
  getUsers: () => void,
  setLastSeen: (messageId: string) => void,
  clearError: () => void,
}