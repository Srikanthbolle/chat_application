import { Button, Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { BiMessageSquareDots } from "react-icons/bi";
import { ConversationsData } from "../../../util/types";
import ConversationOperations from "../../../graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { IModalContext, ModalContext } from "../../../context/ModalContext";

const NoConversationSelected: React.FC = () => {
  const { data, loading, error } = useQuery<ConversationsData, null>(
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
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">{text}</Typography>
        {hasConversations ? (
          <BiMessageSquareDots size={90} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
          >
            Create Conversation
          </Button>
        )}
      </Stack>
    </Box>
  );
};
export default NoConversationSelected;