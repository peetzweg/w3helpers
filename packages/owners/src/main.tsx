import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './app/app';
import '@fontsource/fira-mono/400.css';
import '@fontsource/fira-mono/700.css';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Fira Mono',
    body: 'Fira Mono',
  },
});

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
);
