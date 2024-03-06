import Link from 'next/link';
import styles from '@/styles/PageIndex.module.css';

interface Page {
  title: string;
  path: string;
  date: string;
}

interface PageIndexProps {
  name: string;
  pages: Page[]; // Replace 'Page' with the correct type for your 'pages'
}

// The PageIndex component
const PageIndex = ({ name, pages }: PageIndexProps) => {
  return (
    <div>
      <h1 className={styles.indexTitle}>{name}</h1>
      <ul className={styles.indexList}>
        {pages.map((page, index) => (
          <li key={index} className={styles.indexListItem}>
            <div className={styles.pageContent}>
              <Link href={page.path}>{page.title}</Link>
              <span className={styles.pageDate}>{page.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageIndex;
