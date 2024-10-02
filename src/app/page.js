import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Babble API</h1>
        <p className={styles.description}>
          Babble/s official list of API endpoints and documentation.
        </p>
        <ol className={styles.endpoints}>
          <li>
            <a href="/api/posts" target="_blank" rel="noopener noreferrer">
              /api/posts
            </a>
            <p>Get all posts</p>
          </li>
          <li>
            <a href="/api/posts/1" target="_blank" rel="noopener noreferrer">
              /api/posts/1
            </a>
            <p>Get post by ID</p>
          </li>
          <li>
            <a href="/api/posts/1/comments" target="_blank" rel="noopener noreferrer">
              /api/posts/1/comments
            </a>
            <p>Get comments for post by ID</p>
          </li>
        </ol>
      </main>
      <footer className={styles.footer}>
        <p>
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://www.linkedin.com/in/dillon-jurgens-92979320b/"
            target="_blank"
            rel="noopener noreferrer"
          >Dillon Jurgens</a>
        </p>
      </footer>
    </div>
  );
}
