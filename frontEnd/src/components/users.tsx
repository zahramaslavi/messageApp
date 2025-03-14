import React, { useEffect } from "react";
import { Box, Button, Container, Typography, List, ListItem, ListItemText,  } from "@mui/material";
import { useAuthContext } from '@/contexts/authContext';
import { UserI } from "@/models/user";


const Users: React.FC = () => {
  const { state, getUsers } = useAuthContext();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container sx={{marginTop: 4}}>
      {state.users.length > 0 && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" gutterBottom>Users</Typography>
          <List>
            {state.users.map((user: UserI) => (
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