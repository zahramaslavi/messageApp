import { createContext, useContext, useEffect, useReducer } from "react";
import { MessageContextI, MessageInitStateI } from "@/models/messageContext";
import { ActionI, ProviderProps } from "@/models/context";
import { 
  UPDATE_USERS,
  UPDATE_CURRENT_CHAT_USER_FROM,
  UPDATE_CURRENT_CHAT_USER_TO,
  UPDATE_CURRENT_CHAT_MESSAGES,
  updateUsersAction,
  updateCurrentChatMessagesAction,
  updateCurrentChatUserFromAction,
  updateCurrentChatUserToAction,
} from "./actions/messageAction";
import { 
  ERROR_MESSAGE,
  errorMessageAction,
} from "./actions/errorAction";
import { UserI } from "@/models/user";
import { fetchMessages, sendMessage, sendLastSeen, fetchUsers } from "@/api/message";
import { getFriendlyErrorData } from "./helper/errorHelper";

const initialState: MessageInitStateI = {
  users: [],
  currentChatUserFrom: null,
  currentChatUserTo: null,
  currentChatMessages: [],
  currentChatLastSeen: null,
  errorStatus: null,
  errorMessage: null,
};

const reducer = (state: MessageInitStateI, action: ActionI) => {
  switch (action.type) {
    case UPDATE_USERS:
      return {...state, users: action.payload.users};
    case UPDATE_CURRENT_CHAT_USER_FROM:
      return {...state, currentChatUserFrom: action.payload.user};
    case UPDATE_CURRENT_CHAT_USER_TO:
      return {...state, currentChatUserTo: action.payload.user}; 
    case UPDATE_CURRENT_CHAT_MESSAGES:
      return {...state, currentChatMessages: action.payload.messages};
    case ERROR_MESSAGE:
      return {...state, errorMessage: action.payload.message, errorStatus: action.payload.status}
    default:
      return state;
  }
}

export const MessageContext = createContext<MessageContextI | null>(null);

export const MessageProvider: React.FC<ProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);


  const addMessage = async (text: string) => {
    try {
      const message = await sendMessage(text, state.currentChatUserFrom._id, state.currentChatUserTo._id);

      if (message) {
        dispatch(updateCurrentChatMessagesAction({messages: [...state.currentChatMessages, message]}));

        await setLastSeen(message._id);
      }
    } catch (error) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const selectCurrentChat = async (userFrom: UserI, userTo: UserI) => {
    dispatch(updateCurrentChatUserFromAction({user: userFrom}));
    dispatch(updateCurrentChatUserToAction({user: userTo}));
    
    await getCurrentChatMessages();
  } 

  const getCurrentChatMessages = async () => {
    try {
      const messages = await fetchMessages(state.currentChatUserFrom._id as string);
      if (messages.length) {
        dispatch(updateCurrentChatMessagesAction({messages}));
      }
    } catch (error) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const getUsers = async () => {
    try {
      const users = await fetchUsers();
      
      if (users.length) {
        dispatch(updateUsersAction({users}));
      }
    } catch (error) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const setLastSeen = async (messageId: string) => {
    try {
      const user = await sendLastSeen(state.currentChatUserFrom._id, messageId);

      if (user) {
        dispatch(updateCurrentChatUserFromAction({user}));
      }
    } catch (error) {
      dispatch(errorMessageAction(getFriendlyErrorData(error)));
    }
  }

  const clearError = () => {
    dispatch(errorMessageAction({message: null, status: null}));
  }

  return <MessageContext.Provider value={{messageState: state, addMessage, selectCurrentChat, getCurrentChatMessages, getUsers, setLastSeen, clearError}}>
    {children}
  </MessageContext.Provider>
}

export const useMessageContext = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessageContext must be within MessageProvider");
  }

  return context;
}