import { useQuery } from "@apollo/client";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import ConversationOperations from "../../../../graphql/operations/conversations";
import { formatUsernames } from "../../../../util/functions";
import { ConversationsData } from "../../../../util/types";
import SkeletonLoader from "../../../common/SkeletonLoader";

interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const router = useRouter();
 const { data, loading } = useQuery<ConversationsData>(
    ConversationOperations.Queries.conversations
  );
  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  if (data?.conversations && !loading && !conversation) {
    router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={3}
      sx={{
        py: 3,
        px: { xs: 2, md: 0 },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Button
        sx={{ display: { md: "none" } }}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
        variant="outlined"
      >
        Back
      </Button>
      {loading && <SkeletonLoader count={1} height={30} width={320} />}
      {!conversation && !loading && (
        <Typography>Conversation Not Found</Typography>
      )}
      {conversation && (
        <Stack direction="row" alignItems="center">
          <Typography color="text.secondary">To: </Typography>
          <Typography fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
export default MessagesHeader;