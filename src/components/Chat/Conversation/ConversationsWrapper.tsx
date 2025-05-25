import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { ParticipantPopulated } from "../../../../../backend/src/util/types";
import ConversationOperations from "../../../graphql/operations/conversations";
import MessageOperations from "../../../graphql/operations/messages";
import {
  ConversationCreatedSubscriptionData,
  ConversationDeletedData,
  ConversationsData,
  ConversationUpdatedData,
  MessagesData,
} from "../../../util/types";
import Skeleton from "@mui/material/Skeleton";
import ConversationList from "./ConversationList";
import { Box, useMediaQuery, useTheme } from "@mui/material";

interface ConversationsProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  // ... (keep all the subscription and mutation logic the same as in your original file)

  if (conversationsError) {
    toast.error("There was an error fetching conversations");
    return null;
  }

  return (
    <Box
      sx={{
        display: {
          xs: conversationId ? "none" : "flex",
          md: "flex",
        },
        width: {
          xs: "100%",
          md: "400px",
        },
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        py: 6,
        px: 3,
        position: "relative",
      }}
    >
      {conversationsLoading ? (
        <Box sx={{ width: "100%" }}>
          {[...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={80}
              sx={{ mb: 2, borderRadius: 1 }}
            />
          ))}
        </Box>
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationsWrapper;