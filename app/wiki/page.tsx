import Link from 'next/link';
import PageIndex from '@/components/PageIndex';

const pages = [
  {
    title: 'Clojure [WIP]',
    path: '/wiki/clojure',
    date: '',
  }, {
    title: 'Large Language Models [WIP]',
    path: '/wiki/large_language_models',
    date: '',
  },
];

const Page = () => {
  return (
    <PageIndex name="Wiki" pages={pages} />
  );
};

export default Page;
