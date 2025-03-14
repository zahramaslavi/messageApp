import React, { forwardRef, ForwardedRef,useRef, useEffect } from "react";
import { ListItem, ListItemText, Paper } from "@mui/material";
import { MessageI } from "@/models/message";
import { UserI } from "@/models/user";

interface MessageBoxPropsI {
  i: number,
  msg: MessageI,
  userFrom: UserI,
}

const MessageBox = forwardRef(({i, msg, userFrom}: MessageBoxPropsI, ref: ForwardedRef<HTMLLIElement>|null) => {
  const messageRef = useRef<HTMLLIElement | null>(null);
  
  useEffect(() => {
    if ( messageRef ) {
      messageRef.current?.scrollIntoView({behavior: "smooth"});
    }
  }, []);

  return (
    <ListItem 
      key={i}
      sx={{ justifyContent: msg.sender === userFrom._id ? "flex-end" : "flex-start" }}
      ref={ref}
    >
      <Paper sx={{ p: 1.5, bgcolor: msg.sender === userFrom._id ? "primary.light" : "grey.300" }}>
        <ListItemText primary={msg.text} />
      </Paper>
    </ListItem>
  );
})

export default MessageBox;