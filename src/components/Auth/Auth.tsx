import { useMutation } from "@apollo/client";
import { Avatar, Box, Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import UserOperations from "../../graphql/operations/users";
import { CreateUsernameData, CreateUsernameVariables } from "../../util/types";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;

    try {
      const { data } = await createUsername({
        variables: {
          username,
        },
      });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        toast.error(error);
        return;
      }

      toast.success("Username successfully created");

      /**
       * Reload session to obtain new username
       */
      reloadSession();
    } catch (error) {
      toast.error("There was an error");
      console.log("onSubmit error", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Stack spacing={4} sx={{ width: "100%", textAlign: "center" }}>
        {session ? (
          <>
            <Typography variant="h4">Create a Username</Typography>
            <TextField
              placeholder="Enter a username"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
              fullWidth
            />
            <Button 
              onClick={onSubmit} 
              variant="contained" 
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Avatar 
              src="/images/imessage-logo.png" 
              sx={{ width: 100, height: 100, margin: "0 auto" }} 
            />
            <Typography variant="h3">MessengerQL</Typography>
            <Typography sx={{ width: "70%", margin: "0 auto" }}>
              Sign in with Google to send unlimited free messages to your
              friends
            </Typography>
            <Button
              onClick={() => signIn("google")}
              variant="contained"
              startIcon={<Avatar src="/images/googlelogo.png" sx={{ width: 20, height: 20 }} />}
              sx={{ margin: "0 auto" }}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default Auth;