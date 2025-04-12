import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import UsersList from "./usersList";
import { UserI } from "@/models/user";
import { useAuthContext } from "@/contexts/authContext";
import ChatBox from "./chatBox";
import { useMessageContext } from "@/contexts/messageContext";

const sidebarWidth = 200;

const Chat = () => {
  const { messageState, getUsers, selectCurrentChat } = useMessageContext();
  const { authState } = useAuthContext();
  
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log("message: ", messageState)
  }, [messageState])

  const handleStartChatWith = (toUser: UserI) => {
    const fromUser = messageState.users.find(user => user.username == authState.username);
    
    if (fromUser) {
      selectCurrentChat(fromUser, toUser)
    }
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarWidth,
          p: 2,
          borderRight: "solid 1px lightGray",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UsersList users={messageState.users} loading={false} startChatWith={handleStartChatWith}></UsersList>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {messageState.currentChatUserFrom && messageState.currentChatUserTo &&
          <ChatBox></ChatBox>
        }
      </Box>
    </Box>
  );
}

export default Chat;