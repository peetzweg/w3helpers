import { CollectorPage } from '@w3helpers/page/collector';
import Head from 'next/head';
export function Page() {
  return (
    <>
      <Head>Tokens of Collector</Head>
      <CollectorPage />;
    </>
  );
}

export default Page;
