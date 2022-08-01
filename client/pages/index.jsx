import Head from "next/head";

import { useSelector } from "react-redux";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button } from "@mui/material";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  const current_theme = useSelector((state) => state.theme.current_theme);

  return (
    <div className={styles.container} data-theme={current_theme}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta name="description" content="A voting system on the blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        <section className={styles.landing}>
          <div className={styles.landing_image_container}>
            <h1>
              Jamii Ballots <span>Blockchain Voting</span>
            </h1>
            <Button>Learn more</Button>
          </div>
        </section>
        <section className={styles.landing_2}>
          <div className={styles.landing_2_left}>
            <h2>good &rarr;</h2>
            <p>Voters are able to vote from anywhere in the world!</p>
          </div>
          <div className={styles.landing_2_right}>
            <h2>bad &rarr;</h2>
            <p>Voters are able to vote from anywhere in the world!</p>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.section_image}>
            <Image
              src="/ballot_img2.png"
              alt="ad_1"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.section_text}>
            <h4>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis
              quas temporibus autem obcaecati provident vero incidunt corrupti
              soluta? Similique earum quasi assumenda odio consequuntur vitae
              sunt eius ipsum aperiam tempore! Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Ex error laudantium maxime eligendi,
              nostrum enim accusantium minus iure. Voluptatum maxime unde magni
              eius similique officia numquam? Numquam quidem quos quas eos
              doloribus, atque nemo vero sint facere non similique qui
              distinctio? Asperiores voluptatibus officiis rem quibusdam
              voluptates, alias reiciendis similique.
            </h4>
          </div>
        </section>
        <section
          className={styles.section}
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <div className={styles.section_image}>
            <Image
              src="/ballot_img4.png"
              alt="ad_2"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.section_text}>
            <h4>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis
              quas temporibus autem obcaecati provident vero incidunt corrupti
              soluta? Similique earum quasi assumenda odio consequuntur vitae
              sunt eius ipsum aperiam tempore! Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Ex error laudantium maxime eligendi,
              nostrum enim accusantium minus iure. Voluptatum maxime unde magni
              eius similique officia numquam? Numquam quidem quos quas eos
              doloribus, atque nemo vero sint facere non similique qui
              distinctio? Asperiores voluptatibus officiis rem quibusdam
              voluptates, alias reiciendis similique.
            </h4>
          </div>
        </section>
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

      <Footer />
    </div>
  );
};

export default Home;
