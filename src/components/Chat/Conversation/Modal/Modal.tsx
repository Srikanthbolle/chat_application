import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Avatar,
} from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../../backend/src/util/types";
import ConversationOperations from "../../../../graphql/operations/conversations";
import UserOperations from "../../../../graphql/operations/users";
import {
  CreateConversationData,
  SearchedUser,
  SearchUsersData,
  SearchUsersInputs,
} from "../../../../util/types";
import ConversationItem from "../ConversationItem";
import UserList from "./UserList";
import Participants from "./Participants";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  conversations: Array<ConversationPopulated>;
  editingConversation: ConversationPopulated | null;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
  getUserParticipantObject: (
    conversation: ConversationPopulated
  ) => ParticipantPopulated;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  session,
  conversations,
  editingConversation,
  onViewConversation,
  getUserParticipantObject,
}) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [existingConversation, setExistingConversation] =
    useState<ConversationPopulated | null>(null);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const [
    searchUsers,
    {
      data: searchUsersData,
      loading: searchUsersLoading,
      error: searchUsersError,
    },
  ] = useLazyQuery<SearchUsersData, SearchUsersInputs>(
    UserOperations.Queries.searchUsers
  );

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, { participantIds: Array<string> }>(
      ConversationOperations.Mutations.createConversation
    );

  const [updateParticipants, { loading: updateParticipantsLoading }] =
    useMutation<
      { updateParticipants: boolean },
      { conversationId: string; participantIds: Array<string> }
    >(ConversationOperations.Mutations.updateParticipants);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const onConversationClick = () => {
    if (!existingConversation) return;

    onViewConversation(
      existingConversation.id,
      existingConversation.participants.find((p:any) => p.user.id === userId)
        ?.hasSeenLatestMessage ?? false
    );
    onClose();
  };

  const onSubmit = async () => {
    const participantIds = participants.map((p) => p.id);

    if (editingConversation) {
      // Update existing conversation
      try {
        const { data, errors } = await updateParticipants({
          variables: {
            conversationId: editingConversation.id,
            participantIds: [...participantIds, userId],
          },
        });

        if (!data?.updateParticipants || errors) {
          throw new Error("Failed to update conversation");
        }

        toast.success("Conversation updated!");
        onClose();
      } catch (error: any) {
        console.error("onSubmit error", error);
        toast.error(error?.message);
      }
    } else {
      // Create new conversation
      try {
        const { data, errors } = await createConversation({
          variables: {
            participantIds: [...participantIds, userId],
          },
        });

        if (!data?.createConversation || errors) {
          throw new Error("Failed to create conversation");
        }

        const {
          createConversation: { conversationId },
        } = data;

        router.push({ query: { conversationId } });
        onClose();
      } catch (error: any) {
        console.error("onSubmit error", error);
        toast.error(error?.message);
      }
    }
  };

  useEffect(() => {
    if (editingConversation) {
      const existingParticipants = editingConversation.participants
        .filter((p:any) => p.user.id !== userId)
        .map((p:any) => ({
          id: p.user.id,
          username: p.user.username,
        }));
      setParticipants(existingParticipants);
    }
  }, [editingConversation, userId]);

  useEffect(() => {
    if (participants.length > 0) {
      const foundConversation = findExistingConversation(participants);
      setExistingConversation(foundConversation ?? null);

    } else {
      setExistingConversation(null);
    }
  }, [participants]);

  const findExistingConversation = (participants: SearchedUser[]) => {
    const userIds = participants.map((p) => p.id);
    userIds.push(userId);

    return conversations.find((conversation) => {
      const conversationParticipants = conversation.participants.map(
        (p:any) => p.user.id
      );
      return (
        conversationParticipants.length === userIds.length &&
        conversationParticipants.every((id:any) => userIds.includes(id))
      );
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#2d2d2d",
          color: "white",
        },
      }}
    >
      <DialogTitle>Find or Create a Conversation</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={onSearch} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={!username}
            >
              Search
            </Button>
          </Stack>
        </Box>

        {searchUsersData?.searchUsers && (
          <UserList
            users={searchUsersData.searchUsers}
            participants={participants}
            addParticipant={addParticipant}
          />
        )}

        {participants.length !== 0 && (
          <>
            <Participants
              participants={participants.filter((p) => p.id !== userId)}
              removeParticipant={removeParticipant}
            />
            <Box sx={{ mt: 2 }}>
              {existingConversation && (
                <ConversationItem
                                  userId={userId}
                                  conversation={existingConversation}
                                  onClick={() => onConversationClick()} isSelected={false}                />
              )}
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={!!existingConversation}
              loading={createConversationLoading || updateParticipantsLoading}
              onClick={onSubmit}
            >
              {editingConversation
                ? "Update Conversation"
                : "Create Conversation"}
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConversationModal;