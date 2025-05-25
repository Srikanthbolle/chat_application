import { Avatar, Button, Stack, Typography, Box } from "@mui/material";
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
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <Typography>No users found</Typography>
        </Box>
      ) : (
        <Stack sx={{ mt: 6 }}>
          {users.map((user) => (
            <Stack
              key={user.username}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 1,
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Avatar />
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Typography color="rgba(255, 255, 255, 0.7)">
                  {user.username}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!!participants.find(
                    (participant) => participant.id === user.id
                  )}
                  onClick={() => addParticipant(user)}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
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