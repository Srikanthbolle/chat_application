import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
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
import Participants from "./Participants";
import UserList from "./UserList";

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

  const onSubmit = () => {
    if (!participants.length) return;

    const participantIds = participants.map((p) => p.id);
    const existing = findExistingConversation(participantIds);

    if (existing) {
      toast("Conversation already exists");
      setExistingConversation(existing);
      return;
    }

    editingConversation
      ? onUpdateConversation(editingConversation)
      : onCreateConversation();
  };

  const findExistingConversation = (participantIds: Array<string>) => {
    let existingConversation: ConversationPopulated | null = null;

    for (const conversation of conversations) {
      const addedParticipants = conversation.participants.filter(
        (p) => p.user.id !== userId
      );

      if (addedParticipants.length !== participantIds.length) {
        continue;
      }

      let allMatchingParticipants = false;
      for (const participant of addedParticipants) {
        const foundParticipant = participantIds.find(
          (p) => p === participant.user.id
        );

        if (!foundParticipant) {
          allMatchingParticipants = false;
          break;
        }

        allMatchingParticipants = true;
      }

      if (allMatchingParticipants) {
        existingConversation = conversation;
      }
    }

    return existingConversation;
  };

  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map((p) => p.id)];

    try {
      const { data, errors } = await createConversation({
        variables: {
          participantIds,
        },
      });
      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }
      const {
        createConversation: { conversationId },
      } = data;
      router.push({ query: { conversationId } });

      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.log("createConversations error", error);
      toast.error(error?.message);
    }
  };

  const onUpdateConversation = async (conversation: ConversationPopulated) => {
    const participantIds = participants.map((p) => p.id);

    try {
      const { data, errors } = await updateParticipants({
        variables: {
          conversationId: conversation.id,
          participantIds,
        },
      });

      if (!data?.updateParticipants || errors) {
        throw new Error("Failed to update participants");
      }

      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error) {
      console.log("onUpdateConversation error", error);
      toast.error("Failed to update participants");
    }
  };

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((u) => u.id !== userId));
  };

  const onConversationClick = () => {
    if (!existingConversation) return;

    const { hasSeenLatestMessage } =
      getUserParticipantObject(existingConversation);

    onViewConversation(existingConversation.id, hasSeenLatestMessage);
    onClose();
  };

  useEffect(() => {
    if (editingConversation) {
      setParticipants(
        editingConversation.participants.map((p) => p.user as SearchedUser)
      );
      return;
    }
  }, [editingConversation]);

  useEffect(() => {
    setExistingConversation(null);
  }, [participants]);

  useEffect(() => {
    if (!isOpen) {
      setParticipants([]);
    }
  }, [isOpen]);

  if (searchUsersError) {
    toast.error("Error searching for users");
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Find or Create a Conversation
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#2d2d2d" }}>
        <form onSubmit={onSearch}>
          <Stack spacing={2}>
            <Input
              fullWidth
              placeholder="Enter a username"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              sx={{ color: "white" }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={!username || searchUsersLoading}
              startIcon={searchUsersLoading ? <CircularProgress size={20} /> : null}
            >
              Search
            </Button>
          </Stack>
        </form>
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
            <Box mt={2}>
              {existingConversation && (
                <ConversationItem
                  userId={userId}
                  conversation={existingConversation}
                  onClick={() => onConversationClick()}
                />
              )}
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={!!existingConversation}
              onClick={onSubmit}
              startIcon={
                createConversationLoading || updateParticipantsLoading ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {editingConversation
                ? "Update Conversation"
                : "Create Conversation"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;