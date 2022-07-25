import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta name="description" content="A voting system on the blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#!">Jamii Blockchain Voting!</a>
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>blockchain voting</code>
          <code className={styles.code}>immutability</code>
          <code className={styles.code}>transparency</code>
          <code className={styles.code}>anonymity</code>
          <code className={styles.code}>security</code>
          <code className={styles.code}>accountability</code>
          <code className={styles.code}>inclusivity</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Security &rarr;</h2>
            <p>
              Votes are secured on a public immutable database that cannot be
              changed.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Integrity &rarr;</h2>
            <p>
              No more unnecessary delays or lost ballots, Cast your vote and
              receive results right to your inbox.
            </p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Accessibility &rarr;</h2>
            <p>Voters are able to vote from anywhere in the world!</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Saves Money &rarr;</h2>
            <p>
              Blockchain voting has been shown to reduce the costs involved with
              voting from the equipment to the manpower.
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Inclusivity &rarr;</h2>
            <p>
              Any eligible party can participate in a ballot, blockchain voting
              has resulted in an increase in the voter turnout!
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Anonymity &rarr;</h2>
            <p>There is no way of knowing who cast which vote.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Transparency &rarr;</h2>
            <p>
              This ensures that the ballot and votes casted in it are
              trustworthy by storing them on an immutable blockchain.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
