import { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, IconButton, List } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuthContext } from "@/contexts/authContext";
import { UserI } from "@/models/user";
import MessageBox from "./messageBox";
import LastSeen from "./lastSeen";
import { useMessageContext } from "@/contexts/messageContext";

const ChatBox = () => {
  const messageRef = useRef<HTMLLIElement>(null);
  const [ message, setMessage ] = useState("");
  const { authState } = useAuthContext();
  const { messageState, addMessage, selectCurrentChat, getCurrentChatMessages, getUsers, setLastSeen, clearError } = useMessageContext();

  useEffect(() => {
    getCurrentChatMessages();

    return () => {
      if (messageState.currentChatMessages.length) {
        const lastMessageIndex = messageState.currentChatMessages.length - 1;
        setLastSeen(messageState.currentChatMessages[lastMessageIndex]._id as string)
      }
    }
  }, []);

  useEffect(() => {
    messageRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messageState.currentChatMessages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    await addMessage(message);
    setMessage("");
  }

  const handleMarkAsRead = async () => {
    const lastMessageIndex = messageState.currentChatMessages.length - 1; 
    setLastSeen(messageState.currentChatMessages[lastMessageIndex]._id as string)
  }
  
  return (
    <Box
      sx={{
        margin: 4
      }}
    >
      {
        authState.isAuthenticated &&
        messageState.currentChatUserFrom &&
        messageState.currentChatUserTo &&
        ( 
          <Box 
            sx={{display: "flex", flexDirection: "column", alignItems: "center"}}
          >
            <Typography variant="h5" gutterBottom>
              {`Chat with ${messageState.currentChatUserTo.username}`} 
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
                {messageState.currentChatMessages.length == 0 && "Start chatting"}
                { 
                  messageState.currentChatMessages &&
                  messageState.currentChatMessages.length > 0 &&
                  messageState.currentChatUserFrom &&
                  <List>
                    {messageState.currentChatMessages.map((msg, index) => { return (
                      <MessageBox
                        key={index}
                        msg={msg}
                        userFrom={messageState.currentChatUserFrom as UserI}
                        ref={messageState.currentChatLastSeen == msg._id ? messageRef : null}
                      ></MessageBox>
                        /* {
                          messageState.currentChatLastSeen &&
                          messageState.currentChatLastSeen == msg._id &&
                          messageState.currentChatMessages.length - index - 1 >= 1 &&
                          <LastSeen
                            key={"lastSeen"}
                            notSeenNum={messageState.currentChatMessages.length - index - 1}
                            markAsRead={handleMarkAsRead}
                          ></LastSeen>} */
                      
                      )}
                    )}
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

      {!authState.isAuthenticated && (
          <Typography variant="h4" gutterBottom>
            You are not authenticated!
          </Typography>
      )}
    </Box>
  );
}

export default ChatBox;