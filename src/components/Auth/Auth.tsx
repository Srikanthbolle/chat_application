
import { Avatar, Box, Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");


  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Stack spacing={4} width="100%" alignItems="center">
        {session ? (
          <>
            <Typography variant="h4" component="h1">
              Create a Username
            </Typography>
            <TextField
              fullWidth
              label="Enter a username"
              variant="outlined"
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
            />
            <Button
              fullWidth
              variant="contained"
              onClick={onSubmit}
              
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Avatar 
              src="/images/imessage-logo.png" 
              sx={{ width: 100, height: 100, mb: 2 }} 
              variant="rounded"
            />
            <Typography variant="h3" component="h1">
              MessengerQL
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ maxWidth: '70%' }}>
              Sign in with Google to send unlimited free messages to your friends
            </Typography>
            <Button
              variant="contained"
              onClick={() => signIn("google")}
              startIcon={<GoogleIcon />}
              size="large"
              sx={{ mt: 2 }}
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