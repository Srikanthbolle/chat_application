import { Box } from "@mui/material";
import { Session } from "next-auth";
import React from "react";
// import ConversationsWrapper from "./Conversations/ConversationsWrapper";
// import FeedWrapper from "./Feed/FeedWrapper";
import ModalProvider from "../../context/ModalContext";
import ConversationsWrapper from "./Conversation/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <ModalProvider>
        <ConversationsWrapper session={session} />
        <FeedWrapper session={session} />
      </ModalProvider>
    </Box>
  );
};

export default Chat;