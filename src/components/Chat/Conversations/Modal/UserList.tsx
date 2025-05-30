import { Avatar, Button, Stack, Typography, Box, CircularProgress } from "@mui/material";
import React from "react";
import { SearchedUser } from "../../../../util/types";

interface UserListProps {
  users: Array<SearchedUser>;
  participants: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  participants,
  addParticipant,
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Box mt={3} display="flex" justifyContent="center">
          <Typography variant="body1">No users found</Typography>
        </Box>
      ) : (
        <Stack mt={3} spacing={1}>
          {users.map((user) => (
            <Stack
              key={user.username}
              direction="row"
              alignItems="center"
              spacing={2}
              py={1}
              px={2}
              borderRadius={1}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                }
              }}
            >
              <Avatar />
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography color="text.secondary">{user.username}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!!participants.find(
                    (participant) => participant.id === user.id
                  )}
                  onClick={() => addParticipant(user)}
                  size="small"
                >
                  Select
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};
export default UserList;