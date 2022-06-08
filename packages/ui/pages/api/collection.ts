import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

import { erc721ABI } from 'wagmi';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://eth-mainnet.alchemyapi.io/v2/MN7lukHGqJaLMNZWeQfhkexSKwssvNZq'
  );

  const collection = new ethers.Contract(
    '0x23581767a106ae21c074b2276d25e5c3e136a68b',
    erc721ABI,
    provider
  );
  console.log('hello');
  const name = await collection.callStatic['name()']();

  console.log({ name });
  res.status(200).json({ name });
};

export default handler;
