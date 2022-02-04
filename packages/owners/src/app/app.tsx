import {
  Box,
  Center,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from '@chakra-ui/react';
import { gql, request } from 'graphql-request';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { CheckIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Flex, Spacer } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph';

const tokensByOwner = gql`
  query TokensByOwner($owner: String!, $contract: String!) {
    owner(id: $owner) {
      tokens(where: { contract: $contract }) {
        tokenID
      }
    }
  }
`;

const tokensByOwnerOnBlock = gql`
  query TokensByOwner($owner: String!, $contract: String!, $block: Int!) {
    owner(id: $owner, block: { number: $block }) {
      tokens(where: { contract: $contract }) {
        tokenID
      }
    }
  }
`;

const ownersOfContractOnBlock = gql`
  query OwnersOfContract($contract: String!, $block: Int!, $skip: Int!) {
    ownerPerTokenContracts(
      where: { numTokens_gt: 0, contract: $contract }
      orderBy: numTokens
      orderDirection: desc
      skip: $skip
      block: { number: $block }
    ) {
      owner {
        id
      }
      numTokens
    }
  }
`;

interface TokensByOwnerResponse {
  owner: { tokens: [{ tokenID: string }] };
}
const addressRegex = new RegExp(/^0x[a-fA-F0-9]{40}$/);

function useValidatedInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);
  const [validatedValue, setValidatedInput] = useState<string | null>(null);
  useEffect(() => {
    if (addressRegex.test(value)) {
      setValidatedInput(value.toLocaleLowerCase());
    } else {
      setValidatedInput(null);
    }
  }, [value]);

  return { value, setValue, validatedValue };
}

export function App() {
  const {
    value: owner,
    setValue: setOwner,
    validatedValue: validatedOwner,
  } = useValidatedInput('0x78b35f7b03ff9139a97e097ccc12a85680531d9c');

  const {
    value: collection,
    setValue: setCollection,
    validatedValue: validatedCollection,
  } = useValidatedInput('0x8460bb8eb1251a923a31486af9567e500fc2f43f');

  const { isLoading, error, data } = useQuery(
    ['tokensOf', validatedOwner, validatedCollection],
    () =>
      request<TokensByOwnerResponse>(SUBGRAPH, tokensByOwner, {
        owner: validatedOwner,
        contract: validatedCollection,
      }),
    {
      enabled: !!validatedOwner && !!validatedCollection,
    }
  );
  console.log({ data });

  return (
    <Flex flexDirection={'column'} height={'100vh'}>
      <Center>
        <Box
          marginTop="6"
          minW={'lg'}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="6"
        >
          <Heading>Tokens of</Heading>
          <FormControl paddingBottom={4}>
            <InputGroup>
              <Input
                placeholder="Tokens of"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
              {validatedOwner && !isLoading && (
                <InputRightElement children={<CheckIcon color="blue.500" />} />
              )}
              {isLoading && <InputRightElement children={<Spinner />} />}
            </InputGroup>
            <FormHelperText paddingLeft={2} alignContent={'space-between'}>
              <Link
                isExternal
                color="blue.500"
                href={`https://etherscan.io/address/${owner}`}
              >
                View on Etherscan
                <ExternalLinkIcon marginBottom={'1px'} marginLeft={'1px'} />
              </Link>

              <Link
                marginLeft={6}
                isExternal
                color="blue.500"
                href={`https://opensea.io/${owner}`}
              >
                View on Opensea
                <ExternalLinkIcon marginBottom={'1px'} marginLeft={'1px'} />
              </Link>
            </FormHelperText>
          </FormControl>
          <Heading>in Collection</Heading>
          <FormControl paddingBottom={4}>
            <InputGroup>
              <Input
                placeholder="in Collection"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
              />
              {validatedCollection && !isLoading && (
                <InputRightElement children={<CheckIcon color="blue.500" />} />
              )}
              {isLoading && <InputRightElement children={<Spinner />} />}
            </InputGroup>
            <FormHelperText paddingLeft={2}>
              <Link
                isExternal
                color="blue.500"
                href={`https://etherscan.io/address/${collection}`}
              >
                View on Etherscan
                <ExternalLinkIcon marginBottom={'1px'} marginLeft={'1px'} />
              </Link>

              <Link
                marginLeft={6}
                isExternal
                color="blue.500"
                href={`https://opensea.io/assets?search[query]=${collection}`}
              >
                View on Opensea
                <ExternalLinkIcon marginBottom={'1px'} marginLeft={'1px'} />
              </Link>
            </FormHelperText>
          </FormControl>
        </Box>
      </Center>

      {isLoading && (
        <Center minH={'sm'}>
          <CircularProgress isIndeterminate color="blue.500" />
        </Center>
      )}
      {data && !isLoading && data.owner?.tokens && (
        <Center>
          <Box
            minW={'lg'}
            marginTop={'6'}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Textarea
              minH={'sm'}
              variant={'filled'}
              readOnly
              value={data.owner.tokens
                .map((tokens) => tokens.tokenID)
                .join('\n')}
              placeholder="Here is a sample placeholder"
            />

            {/* <Center>
              <Button margin="2" variant="ghost">
                Copy to Clipboard
              </Button>
            </Center> */}
          </Box>
        </Center>
      )}
    </Flex>
  );
}

export default App;
