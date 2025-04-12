import React, { useEffect } from "react";
import { Box, Button, Container, Typography, List, ListItem, ListItemText,  } from "@mui/material";
import { UserI } from "@/models/user";
import { useMessageContext } from "@/contexts/messageContext";


const Users: React.FC = () => {
  const { messageState, getUsers } = useMessageContext();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container sx={{marginTop: 4}}>
      {messageState.users.length > 0 && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" gutterBottom>Users</Typography>
          <List>
            {messageState.users.map((user: UserI) => (
              <ListItem key={user.username}>
                <ListItemText primary={user.username}/>
              </ListItem>
            ))}
          </List>
          <Button type="submit" variant="contained" onClick={getUsers}>Refresh users</Button>
        </Box>
      )}
    </Container>
  );
};

export default Users;