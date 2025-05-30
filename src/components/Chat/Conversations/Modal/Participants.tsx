import { Stack, Button, Box, Typography, Chip } from "@mui/material";
import React from "react";
import { Close } from "@mui/icons-material";
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
    <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
      {participants.map((participant) => (
        <Chip
          key={participant.id}
          label={participant.username}
          onDelete={() => removeParticipant(participant.id)}
          deleteIcon={<Close />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            color: 'text.primary',
            '& .MuiChip-deleteIcon': {
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }
          }}
        />
      ))}
    </Box>
  );
};
export default Participants;