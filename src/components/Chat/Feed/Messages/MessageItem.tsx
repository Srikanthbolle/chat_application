import { Avatar, Box, Stack, Typography } from "@mui/material";
import { formatRelative } from "date-fns";
import {enUS} from "date-fns/locale/en-US";
import React from "react";
import { MessagePopulated } from "../../../../../../backend/src/util/types";

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

const MessageItem: React.FC<MessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 2,
        "&:hover": { backgroundColor: "action.hover" },
        justifyContent: sentByMe ? "flex-end" : "flex-start",
        wordBreak: "break-word",
      }}
    >
      {!sentByMe && (
        <Box sx={{ alignSelf: "flex-end" }}>
          <Avatar sx={{ width: 32, height: 32 }} />
        </Box>
      )}
      <Stack sx={{ width: "100%", gap: 0.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && (
            <Typography fontWeight={500} textAlign={sentByMe ? "right" : "left"}>
              {message.sender.username}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: sentByMe ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 4,
              maxWidth: "65%",
              bgcolor: sentByMe ? "primary.main" : "background.paper",
              color: sentByMe ? "primary.contrastText" : "text.primary",
            }}
          >
            <Typography>{message.body}</Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default MessageItem;