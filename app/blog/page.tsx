import Link from 'next/link';
import PageIndex from '@/components/PageIndex';

const pages = [
  {
    title: 'Building a custom raspberry pi image - pt. 1',
    path: '/blog/2020-12-07-custom-rpi-pt1',
    date: '2020-12-07',
  }, {
    title: 'Building A Custom Raspberry Pi Image - pt. 2',
    path: '/blog/2022-09-19-custom-rpi-pt2',
    date: '2022-09-19',
  }, {
    title: 'Building a Quadcopter - pt. 1',
    path: '/blog/2024-02-28-quadcopter-build-pt1',
    date: '2024-02-28',
  },
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
