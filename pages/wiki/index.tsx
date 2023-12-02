import Link from 'next/link';
import AppContainer from '../../components/AppContainer.tsx';

const WikiIndex = () => {
  const wikiPages = [
    { title: 'Clojure', path: '/wiki/clojure' },
  ];

  return (
    <AppContainer title="Elton Law" description="Wiki">
      <h1>Wiki Index</h1>
      <ul>
        {wikiPages.map(page => (
          <li key={page.path}>
            <Link href={page.path}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </AppContainer>
  );
};

export default WikiIndex;
