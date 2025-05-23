import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";


import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProps } from 'next/app';
import Head from 'next/head';
import theme from '@/mui/theme';
// import { ChakraProvider } from "@chakra-ui/react";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
 
 <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={session}>
      
      <Component {...pageProps} />
   
    </SessionProvider>
      </ThemeProvider>
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
