import Link from 'next/link';
import PageIndex from '@/components/PageIndex';

const pages = [
  {
    title: 'Building a Custom Raspberry Pi Image: Part 1',
    path: '/blog/2020-12-07-custom-rpi-part-1',
    date: '2020-12-07',
  }, {
    title: 'Building a Custom Raspberry Pi Image: Part 2',
    path: '/blog/2022-09-19-custom-rpi-part-2',
    date: '2022-09-19',
  }, {
    title: 'Building a Quadcopter: Part 1',
    path: '/blog/2024-02-28-quadcopter-build-part-1',
    date: '2024-02-28',
  }, {
    title: 'Building a Quadcopter: Part 2',
    path: '/blog/2024-03-18-quadcopter-build-part-2',
    date: '2024-03-18',
  }, {
    title: 'Building a Grow Box Part 1 - STM32 basics',
    path: '/blog/2024-06-16-grow-box-part-1',
    date: '2024-06-16',
  }, {
    title: 'Building a Grow Box Part 2 - Startup',
    path: '/blog/2024-07-17-grow-box-part-2',
    date: '2024-07-17',
  }
].sort((a, b) => {
  // sort in descending order of date
  const dateRegex = /(\d{4}-\d{2}-\d{2})/;
  const matchA = a.path.match(dateRegex);
  const matchB = b.path.match(dateRegex);
  const dateA = matchA ? new Date(matchA[0]) : new Date(0); // default to epoch if no match
  const dateB = matchB ? new Date(matchB[0]) : new Date(0); // default to epoch if no match

  return dateB.getTime() - dateA.getTime();
});

const Page = () => {
  return (
    <PageIndex name="Blog" pages={pages} />
  );
};

export default Page;
