'use client';

import Auth from '@/components/Auth/Auth';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Chat from '@/components/Chat/chat';

interface HomeProps {
  userData: Session | null;
}

export default function Home({ userData }: HomeProps) {
  const { data: session, status } = useSession();
  console.log('data is',session)
  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {session?.user ? <Chat /> : <Auth session={session} reloadSession={function (): void {
        throw new Error('Function not implemented.');
      } }/>}
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const userData = await getSession(context);
  return {
    props: {
      userData,
    },
  };
}