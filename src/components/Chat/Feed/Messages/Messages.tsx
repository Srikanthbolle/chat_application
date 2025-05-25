import { useQuery } from "@apollo/client";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/messages";
import {
  MessagesData,
  MessagesSubscriptionData,
  MessagesVariables,
} from "../../../../util/types";
import SkeletonLoader from "../../../common/SkeletonLoader";
import MessageItem from "./MessageItem";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (!messagesEndRef.current || !data) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, messagesEndRef.current]);

  if (error) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {loading && (
        <Stack spacing={2} sx={{ px: 2 }}>
          <SkeletonLoader count={4} height={60} />
        </Stack>
      )}
      {data?.messages && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>
      )}
    </Box>
  );
};
export default Messages;