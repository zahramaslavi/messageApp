import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import UsersList from "./usersList";
import { UserI } from "@/models/user";
import { useAuthContext } from "@/contexts/authContext";
import ChatBox from "./chatBox";

const sidebarWidth = 200;

const Chat = () => {
  const [ chatWith, setChatWith ] = useState<UserI|null>(null);
  const [ chatFrom, setChatFrom ] = useState<UserI|null>(null);
  const { state, getUsers } = useAuthContext();
  
  useEffect(() => {
    getUsers();
  }, []);

  const handleStartChatWith = (user: UserI) => {
    setChatWith(user);
    const fromUser = state.users.find(user => user.username == state.username)
    setChatFrom(fromUser ? fromUser : null);
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
        <UsersList users={state.users} loading={false} startChatWith={handleStartChatWith}></UsersList>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {chatWith && chatFrom &&
          <ChatBox
            userFrom={chatFrom} 
            userTo={chatWith}
          ></ChatBox>
        }
        
      </Box>
    </Box>
  );
}

export default Chat;