import Image from "next/image";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <a
          href="https://ethereum.org/en/dapps/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footer_details}
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src="/ethereum.svg"
              alt="Ethereum Logo"
              width={72}
              height={35}
            />
          </span>
          ethereum
        </a>
        <div className={styles.footer_image_container}>
          <Image
            className={styles.footer_image}
            src="/ballot_img1.png"
            alt="Ethereum Logo"
            width={300}
            height={50}
          />
        </div>
      </footer>
    </>
  );
};

export default Footer;
