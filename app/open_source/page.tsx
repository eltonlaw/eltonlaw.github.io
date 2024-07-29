import Link from 'next/link';
import styles from '@/styles/OpenSource.module.css';

const oscs = [
  {
    title: '[#309] fix: adjust docker compose cmd for v1 and v2',
    link: 'https://github.com/aws/aws-mwaa-local-runner/pull/309',
    date: '2023-09-12',
    repo: 'aws/aws-mwaa-local-runner',
  }, {
    title: '[#604] Bump log4j2 version for cve-2021-44228',
    link: 'https://github.com/dakrone/clj-http/pull/604',
    date: '2021-12-16',
    repo: 'darkone/clj-http',
  }, {
    title: '[#21858] Fix G5 IJ with Motion Mode',
    link: 'https://github.com/MarlinFirmware/Marlin/pull/21858',
    date: '2021-05-09',
    repo: 'MarlinFirmware/Marlin',
  }, {
    title: '[#21771] Allow disable of currently-required POWER_TIMEOUT',
    link: 'https://github.com/MarlinFirmware/Marlin/pull/21771',
    date: '2021-05-02',
    repo: 'MarlinFirmware/Marlin',
  }, {
    title: "[#4111] /api/files: add unselect file command",
    link: "https://github.com/OctoPrint/OctoPrint/pull/4111",
    date: "2021-04-25",
    repo: "OctoPrint/OctoPrint",
  }, {
    title: "[#3429] disable autocomplete on hide - pt.2",
    link: "https://github.com/openscad/openscad/pull/3429",
    date: "2020-09-05",
    repo: "openscad/openscad",
  }, {
    title: "[#3423] disable editor when hidden",
    link: "https://github.com/openscad/openscad/pull/3423",
    date: "2020-08-30",
    repo: "openscad/openscad",
  }, {
    title: "[#3148] docs: add uninstall notes to faq",
    link: "https://github.com/Klipper3d/klipper/pull/3148",
    date: "2020-08-02",
    repo: "Klipper3d/klipper",
  }, {
    title: "[#73909] #[deny(unsafe_op_in_unsafe_fn)] in libstd/fs.rs ",
    link: "https://github.com/rust-lang/rust/pull/73909",
    date: "2020-06-30",
    repo: "rust-lang/rust",
  }, {
    title: "[CLJS-3166] def in a letfn function emits unwanted warning",
    link: "https://clojure.atlassian.net/browse/CLJS-3166",
    date: "2019-12-11",
    repo: "clojure/clojurescript",
  }, {
    title: "[CLJS-3173] case statement with embedded list test constant",
    link: "https://clojure.atlassian.net/browse/CLJS-3173",
    date: "2019-11-23",
    repo: "clojure/clojurescript",
  }, {
    title: "[#6] Support readline 8 on Linux",
    link: "https://github.com/jini-zh/sbcl-readline/pull/6",
    date: "2019-07-23",
    repo: "jini-zh/sbcl-readline",
  }, {
    title: "[#1396] log chained exceptions",
    link: "https://github.com/pallets/werkzeug/pull/1396",
    date: "2018-11-13",
    repo: "pallets/werkzeug",
  }
].sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB.getTime() - dateA.getTime();
});

const OpenSource = () => {
  return (
    <div>
      <h2>Open Source Activity</h2>
      <ul className={styles.oscList}>
        {oscs.map((osc, index) => (
          <li key={index} className={`${styles.oscItem} ${styles.oscLi}`}>
            <span className={`${styles.date} ${styles.oscLi}`}>{osc.date}</span>
            <span className={`${styles.repo} ${styles.oscLi}`}>{osc.repo}</span>
            <Link href={osc.link} className={`${styles.title} ${styles.oscLi}`}>
              {osc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenSource;
