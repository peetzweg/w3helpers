import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@w3helpers/ui-shared';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>w3helpers</title>
      </Head>
      <main className="app">
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </main>
    </>
  );
}

export default CustomApp;
