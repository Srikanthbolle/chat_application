import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useState } from "react";
import { GoDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { formatUsernames } from "../../../util/functions";
import { ConversationPopulated } from "../../../../../backend/src/util/types";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

interface ConversationItemProps {
  userId: string;
  conversation: ConversationPopulated;
  onClick: () => void;
  isSelected: boolean;
  onEditConversation?: () => void;
  hasSeenLatestMessage?: boolean;
  onDeleteConversation?: (conversationId: string) => void;
  onLeaveConversation?: (conversation: ConversationPopulated) => void;
}

const StyledMenuItem = styled(MenuItem)({
  gap: "8px",
  padding: "8px 16px",
});

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
  hasSeenLatestMessage,
  onEditConversation,
  onDeleteConversation,
  onLeaveConversation,
}) => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition(
      contextMenuPosition === null
        ? { top: event.clientY, left: event.clientX }
        : null
    );
  };

  const handleClose = () => {
    setContextMenuPosition(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{
        cursor: "pointer",
        borderRadius: 1,
        backgroundColor: isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        position: "relative",
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {!hasSeenLatestMessage && (
        <Box sx={{ position: "absolute", left: "-6px" }}>
          <GoDot fontSize={18} color="#6B46C1" />
        </Box>
      )}

      <Avatar sx={{ width: 32, height: 32 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            height: "100%",
          }}
        >
          <Typography
            fontWeight={600}
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {formatUsernames(conversation.participants, userId)}
          </Typography>
          {conversation.latestMessage && (
            <Box sx={{ width: "140%" }}>
              <Typography
                color="rgba(255, 255, 255, 0.7)"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {conversation.latestMessage.body}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography color="rgba(255, 255, 255, 0.7)" textAlign="right">
          {formatRelative(conversation.updatedAt, new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token: any) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Typography>
      </Box>

      <Menu
        open={contextMenuPosition !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenuPosition || undefined}
      >
        {onEditConversation && (
          <StyledMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEditConversation();
              handleClose();
            }}
          >
            <AiOutlineEdit fontSize={20} />
            Edit
          </StyledMenuItem>
        )}

        {conversation.participants.length > 2 ? (
          onLeaveConversation && (
            <StyledMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onLeaveConversation(conversation);
                handleClose();
              }}
            >
              <BiLogOut fontSize={20} />
              Leave
            </StyledMenuItem>
          )
        ) : (
          onDeleteConversation && (
            <StyledMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
                handleClose();
              }}
            >
              <MdDeleteOutline fontSize={20} />
              Delete
            </StyledMenuItem>
          )
        )}
      </Menu>
    </Stack>
  );
};

export default ConversationItem;