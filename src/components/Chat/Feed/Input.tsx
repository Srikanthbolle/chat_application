import { useMutation } from "@apollo/client";
import { Box, TextField } from "@mui/material";
// import { ObjectID } from "mongodb";
  import { v4 as uuidv4 } from "uuid";
import { Session } from "next-auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../graphql/operations/messages";
import { MessagesData, SendMessageVariables } from "../../../util/types";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageVariables
  >(MessageOperations.Mutations.sendMessage);

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { id: senderId } = session.user;
    
const newId = uuidv4();
      const newMessage: SendMessageVariables = {
        id: newId,
        senderId,
        conversationId,
        body: messageBody,
      };
      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody("");
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: newId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
    } catch (error: any) {
      console.log("onSendMessage error", error);
      toast.error(error?.message);
    }
  };

  return (
    <Box sx={{ px: 2, py: 3, width: "100%" }}>
      <form onSubmit={onSendMessage}>
        <TextField
          fullWidth
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          size="small"
          placeholder="New message"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              "& fieldset": {
                borderColor: "divider",
              },
              "&:hover fieldset": {
                borderColor: "divider",
              },
              "&.Mui-focused fieldset": {
                borderColor: "divider",
              },
            },
          }}
        />
      </form>
    </Box>
  );
};
export default MessageInput;