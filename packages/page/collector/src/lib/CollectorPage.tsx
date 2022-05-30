import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Skeleton,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { gql, request } from 'graphql-request';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

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

export function CollectorPage() {
  const {
    value: owner,
    setValue: setOwner,
    validatedValue: validatedOwner,
  } = useValidatedInput('0x8682a78Ea82bd94C3E250539079119B6Eef132db');

  const {
    value: collection,
    setValue: setCollection,
    validatedValue: validatedCollection,
  } = useValidatedInput('0x23581767a106ae21c074b2276d25e5c3e136a68b');

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
  console.log({ error });

  return (
    <HStack flexDirection={'column'} height="100vh" width="100vw">
      <Box
        marginTop="6"
        width={'100%'}
        maxWidth={'960px'}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="6"
      >
        <Heading>Collection</Heading>
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

        <Heading>Collector</Heading>
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

        {isLoading ? (
          <Skeleton minH={'sm'} borderRadius={'md'} />
        ) : (
          <Textarea
            minH={'sm'}
            variant={'filled'}
            readOnly
            value={
              data
                ? data.owner?.tokens
                  ? data.owner.tokens.map((tokens) => tokens.tokenID).join('\n')
                  : 'Collector does not have any tokens of this collection.'
                : 'Enter a collector and collection address to see their tokens.'
            }
          />
        )}
        <Text>{`Total: ${data?.owner?.tokens.length || 0}`}</Text>
      </Box>
    </HStack>
  );
}

export default CollectorPage;
