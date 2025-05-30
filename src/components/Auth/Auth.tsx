import { useMutation } from "@apollo/client";
import { Avatar, Box, Button, CircularProgress, Container, Input, Stack, Typography } from "@mui/material";
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
console.log('first',data)
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
reloadSession(); // will fetch session with updated username

    } catch (error) {
      toast.error("There was an error");
      console.log("onSubmit error", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Stack spacing={4} sx={{ width: "100%" }} alignItems="center">
        {session ? (
          <>
            <Typography variant="h4">Create a Username</Typography>
            <Input
              fullWidth
              placeholder="Enter a username"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
            />
            <Button 
              onClick={onSubmit} 
              fullWidth 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Avatar 
              src="/imessenger.jpg" 
              sx={{ width: 100, height: 100 }}
              variant="square"
            />
            <Typography variant="h3">MessengerQL</Typography>
            <Typography variant="body1" textAlign="center" sx={{ width: "70%" }}>
              Sign in with Google to send unlimited free messages to your friends
            </Typography>
            <Button
              onClick={() => signIn("google")}
              variant="contained"
              startIcon={<Avatar src="/googlelogo.png" sx={{ width: 20, height: 20 }} />}
              fullWidth
              sx={{ textTransform: "none" }}
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