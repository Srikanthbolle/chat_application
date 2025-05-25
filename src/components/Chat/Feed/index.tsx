import { Box } from "@mui/material";
import { Session } from "next-auth";
import React from "react";
import ConversationsWrapper from "../Conversation/ConversationsWrapper";
import FeedWrapper from "./FeedWrapper";
import ModalProvider from "@/context/ModalContext";
// import ModalProvider from "../../context/ModalContext";

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <ModalProvider>
        <ConversationsWrapper session={session} />
        <FeedWrapper session={session} />
      </ModalProvider>
    </Box>
  );
};

export default Chat;