import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { formatRelative, Locale, FormatRelativeFn } from "date-fns";
import { enUS } from "date-fns/locale";
import { GoDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { formatUsernames } from "../../../util/functions";
import { ConversationPopulated } from "../../../../../backend/src/util/types";

// Define our custom relative time format with all possible tokens
const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
  tomorrow: "'Tomorrow",
  nextWeek: "'Next Week",
  nextMonth: "'Next Month",
  nextYear: "'Next Year",
  previousWeek: "'Last Week",
  previousMonth: "'Last Month",
  previousYear: "'Last Year",
} as const;

// Type-safe formatRelative function
const formatRelativeFn: FormatRelativeFn = (token, _date, _baseDate, _options) => {
  const formatMap: Record<string, string> = {
    ...formatRelativeLocale,
    default: formatRelativeLocale.other
  };
  return formatMap[token] || formatMap.default;
};

// Create custom locale
const customLocale: Locale = {
  ...enUS,
  formatRelative: formatRelativeFn
};

// Custom format function
const formatDateRelative = (date: Date): string => {
  return formatRelative(date, new Date(), { locale: customLocale });
};

// Rest of the component remains the same...
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
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const closeMenu = () => {
    setMenuPosition(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        cursor: "pointer",
        borderRadius: 1,
        bgcolor: isSelected ? "rgba(255, 255, 255, 0.2)" : "none",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.2)",
        },
        position: "relative",
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {hasSeenLatestMessage === false && (
        <GoDot
          fontSize={18}
          color="#6B46C1"
          style={{
            position: "absolute",
            left: "-6px",
          }}
        />
      )}

      <Avatar sx={{ width: 32, height: 32, mr: 1 }} />

      <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", overflow: "hidden" }}>
        <Box sx={{ flex: 0.7, overflow: "hidden" }}>
          <Typography
            variant="body1"
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
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {conversation.latestMessage.body}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          {formatDateRelative(new Date(conversation.updatedAt))}
        </Typography>
      </Box>

      <Menu
        open={!!menuPosition}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition ? { top: menuPosition.y, left: menuPosition.x } : undefined
        }
        MenuListProps={{
          sx: {
            bgcolor: "#2d2d2d",
            color: "white",
          },
        }}
      >
        {onEditConversation && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEditConversation();
              closeMenu();
            }}
          >
            <ListItemIcon>
              <AiOutlineEdit fontSize={20} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {conversation.participants.length > 2 ? (
          onLeaveConversation && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onLeaveConversation(conversation);
                closeMenu();
              }}
            >
              <ListItemIcon>
                <BiLogOut fontSize={20} />
              </ListItemIcon>
              <ListItemText>Leave</ListItemText>
            </MenuItem>
          )
        ) : (
          onDeleteConversation && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
                closeMenu();
              }}
            >
              <ListItemIcon>
                <MdDeleteOutline fontSize={20} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  );
};

export default ConversationItem;