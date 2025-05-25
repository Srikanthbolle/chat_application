import { Stack, Button, Box, Typography, IconButton } from "@mui/material";
import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { SearchedUser } from "../../../../util/types";

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "row", 
      mt: 4, 
      flexWrap: "wrap", 
      gap: "10px" 
    }}>
      {participants.map((participant) => (
        <Stack
          key={participant.id}
          direction="row"
          alignItems="center"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            p: 1,
          }}
        >
          <Typography>{participant.username}</Typography>
          <IconButton
            size="small"
            onClick={() => removeParticipant(participant.id)}
            sx={{ ml: 1 }}
          >
            <IoIosCloseCircleOutline size={20} />
          </IconButton>
        </Stack>
      ))}
    </Box>
  );
};
export default Participants;