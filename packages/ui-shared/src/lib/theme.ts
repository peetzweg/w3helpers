import '@fontsource/fira-mono/400.css';
import '@fontsource/fira-mono/700.css';
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  fonts: {
    heading: 'Open Sans, sans-serif',
    body: 'Open Sans, sans-serif',
    mono: 'Fira Mono',
  },
});
