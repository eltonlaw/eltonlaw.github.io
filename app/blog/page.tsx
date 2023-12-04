import Link from 'next/link';
import PageIndex from '@/components/PageIndex';

const pages = [
  { title: 'Building A Custom Raspberry Pi Image - pt. 1', path: '/blog/2020-12-07-custom-rpi-pt1' },
  { title: 'Building A Custom Raspberry Pi Image - pt. 2', path: '/blog/2022-09-19-custom-rpi-pt2' },
].sort((a, b) => {
  // sort in descending order of date
  const dateRegex = /(\d{4}-\d{2}-\d{2})/;
  const dateA = new Date(a.path.match(dateRegex)[0]);
  const dateB = new Date(b.path.match(dateRegex)[0]);
  return dateB - dateA;
});

const Page = () => {
  return (
    <PageIndex name="Blog" pages={pages} />
  );
};

export default Page;
