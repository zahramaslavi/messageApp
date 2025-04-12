import { MessageI } from "@/models/message";
import { UserI } from "@/models/user";

export const UPDATE_USERS = "update_users";
export const UPDATE_CURRENT_CHAT_USER_FROM = "update_current_user_from"; 
export const UPDATE_CURRENT_CHAT_USER_TO = "update_current_user_to";
export const UPDATE_CURRENT_CHAT_MESSAGES = "update_current_chat_messages";

interface UsersDataI {
  users: UserI[]
}

interface CurrentChatUserFromDataI {
  user: UserI
}

interface CurrentChatUserToDataI {
  user: UserI
}

interface CurrentChatMessagesDataI {
  messages: MessageI[]
}

export const updateUsersAction = (usersData: UsersDataI) => ({type: UPDATE_USERS, payload: usersData});
export const updateCurrentChatUserFromAction = (currentChatUserFromData: CurrentChatUserFromDataI) => ({type: UPDATE_CURRENT_CHAT_USER_FROM, payload: currentChatUserFromData});
export const updateCurrentChatUserToAction = (currentChatUserToData: CurrentChatUserToDataI) => ({type: UPDATE_CURRENT_CHAT_USER_TO, payload: currentChatUserToData});
export const updateCurrentChatMessagesAction = (currentChatMessagesData: CurrentChatMessagesDataI) => ({type: UPDATE_CURRENT_CHAT_MESSAGES, payload: currentChatMessagesData});