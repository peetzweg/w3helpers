import { Link, VStack } from '@chakra-ui/react';

export function Index() {
  return (
    <VStack height={'100vh'} alignItems="center" justifyContent={'center'}>
      <Link href="/collector">Tokens of Collector</Link>
    </VStack>
  );
}

export default Index;
