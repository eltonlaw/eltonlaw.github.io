import Link from 'next/link';
import PageIndex from '@/components/PageIndex';

const pages = [
  { title: 'Clojure', path: '/wiki/clojure' },
  { title: 'Large Language Models', path: '/wiki/large_language_models' },
];

const Page = () => {
  return (
    <PageIndex name="Wiki" pages={pages} />
  );
};

export default Page;
