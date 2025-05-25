import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";



import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProps } from 'next/app';
import Head from 'next/head';
import theme from '@/mui/theme';
import {ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/apollo-client";
import { Toaster } from "react-hot-toast";
// import { ChakraProvider } from "@chakra-ui/react";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
 
 <>
 <ApolloProvider client={client}>
  <Head>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
  </Head>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  </ThemeProvider>
</ApolloProvider>

     
    </>
    
   
  );
}


// pages/_app.tsx


// export default function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <>
//       <Head>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <SessionProvider session={session}>
      
//       <Component {...pageProps} />
   
//     </SessionProvider>
//       </ThemeProvider>
//     </>
//   );
// }
