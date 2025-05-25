import React, { useContext } from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import { BiMessageSquareDots } from "react-icons/bi";
import { ConversationsData } from "../../../util/types";
import ConversationOperations from "../../../graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { IModalContext, ModalContext } from "../../../context/ModalContext";

const NoConversation: React.FC = () => {
  const { data, loading, error } = useQuery<ConversationsData>(
    ConversationOperations.Queries.conversations
  );
  const { openModal } = useContext<IModalContext>(ModalContext);

  if (!data?.conversations || loading || error) return null;

  const { conversations } = data;
  const hasConversations = conversations.length;
  const text = hasConversations
    ? "Select a Conversation"
    : "Let's Get Started 🥳";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">{text}</Typography>
        {hasConversations ? (
          <BiMessageSquareDots fontSize={90} />
        ) : (
          <Button 
            variant="contained" 
            onClick={openModal}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Create Conversation
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default NoConversation;