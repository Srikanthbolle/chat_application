import { Box } from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";

import MessagesHeader from "./Messages/Header";
import Messages from "./Messages/Messages";
import MessageInput from "./Input";
import NoConversationSelected from "./NoConversationSelected";


interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;

  return (
    <Box
      sx={{
        display: {
          xs: conversationId ? "flex" : "none",
          md: "flex",
        },
        flexDirection: "column",
        width: "100%",
      }}
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            <MessagesHeader
              userId={session.user.id}
              conversationId={conversationId}
            />
            <Messages
              userId={session.user.id}
              conversationId={conversationId}
            />
          </Box>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <NoConversationSelected />
      )}
    </Box>
  );
};

export default FeedWrapper;