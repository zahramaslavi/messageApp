import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, IconButton, List } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuthContext } from "@/contexts/authContext";
import { UserI } from "@/models/user";
import { MessageI } from "@/models/message";
import { fetchMessages, sendMessage } from "@/api/message";
import MessageBox from "./messageBox";

interface ChatBoxPropsI {
  userFrom: UserI,
  userTo: UserI
}

const ChatBox = ({userFrom, userTo}: ChatBoxPropsI) => {
  const messageRef = useRef<HTMLLIElement>(null);
  const [ message, setMessage ] = useState("");
  const [ messages, setMessages ] = useState<MessageI[]>([]);
  const { state } = useAuthContext();

  useEffect(() => {
    console.log(state.isAuthenticated)
    const getMessages = async () => {
      const fetchedMessages = await fetchMessages(userFrom._id);
      console.log(fetchedMessages);

      if (fetchedMessages.length) {
        setMessages(fetchedMessages);
      }
    }

    getMessages();
  }, []);

  useEffect(() => {
    console.log(messages);
    messageRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = await sendMessage(userFrom._id, message, userTo._id);
    setMessages([...messages, newMessage]);
    setMessage("");
  }
  
  return (
    <Box
      sx={{
        margin: 4
      }}
    >
      {state.isAuthenticated && 
        ( 
          <Box 
            sx={{display: "flex", flexDirection: "column", alignItems: "center"}}
          >
            <Typography variant="h5" gutterBottom>
              {`Chat with ${userTo.username}`} 
            </Typography>
            <Box 
              sx={{ 
                width: "-webkit-fill-available",
                height: "70vh",
                display: "flex",
                flexDirection: "column",
                p: 2,
                overflowY: "auto",
                mb: 1
              }}
            >
              <Box 
                sx={{ 
                  flexGrow: 1,
                  overflowY: "auto",
                  mb: 1,
                  "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar in WebKit browsers
                  scrollbarWidth: "none", // Hide scrollbar in Firefox
                }}
              >
                {messages.length == 0 && "Start chatting"}
                { 
                  messages.length > 0 &&
                  <List>
                    {messages.map((msg, index) => (
                      <MessageBox
                        i={index}
                        msg={msg}
                        userFrom={userFrom}
                        ref={index == messages.length - 1 ? messageRef : null}
                      ></MessageBox>
                    ))}
                  </List>
                }
              </Box>

              {/* Input Field */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )
      } 

      {!state.isAuthenticated && (
          <Typography variant="h4" gutterBottom>
            You are not authenticated!
          </Typography>
      )}
    </Box>
  );
}

export default ChatBox;