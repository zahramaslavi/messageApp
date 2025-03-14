
import { Box, Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { UserI } from "@/models/user";
import { useAuthContext } from "@/contexts/authContext";

interface UsersListI {
  users: UserI[],
  loading: boolean,
  startChatWith: (user: UserI) => void
}

const UsersList = ({users, loading, startChatWith}: UsersListI) => {
  const { state } = useAuthContext();
  return (
    <Container sx={{marginTop: 6}}>
      {loading && (<Typography variant="h5" gutterBottom>Loading friends</Typography>)}

      {!loading && users.length == 0 && (<Typography variant="h5" gutterBottom>No friends to show</Typography>)}

      {!loading && users.length > 0 && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" gutterBottom>Friends</Typography>
          <List>
            {users.map((user: UserI) => {
              if ( user.username == state.username ) return null;

              return (
                <ListItem 
                  key={user.username}
                >
                  <ListItemText primary={user.username} onClick={() => startChatWith(user)}/>
                </ListItem>
              )
            })}
          </List>
        </Box>
      )}
    </Container>
  ); 
}

export default UsersList;