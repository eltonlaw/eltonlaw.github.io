import Link from 'next/link';
import styles from '@/styles/PageIndex.module.css';

// The PageIndex component
const PageIndex = ({ name, pages }) => {
  return (
    <div>
      <h1 className={styles.indexTitle}>{name}</h1>
      <ul className={styles.indexList}>
        {pages.map((page, index) => (
          <li key={index} className={styles.indexListItem}>
            <Link href={page.path}> {page.title} </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageIndex;
