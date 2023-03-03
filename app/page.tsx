import Image from "next/image";
import { CommandMenu } from "./components/Command";
import background from "../public/background.png";

import styles from "./page.module.css";
import { CSSProperties } from "react";

export default function Home() {
  return (
    <main
      className={styles.background}
      style={
        {
          "--bg-image-url": `url(${background.src})`,
        } as CSSProperties
      }
    >
      <div className={styles.main}>
        <div className={styles.textContainer}>
          <h1 className={styles.fadein}>Books</h1>
          <p className={styles.fadein}>
            Books is a simple way to track your reading -- you could almost say
            it was boring. But in this context, simple means quick and
            effortless. A book tracker that allows you to focus on the books,
            not the tracking.
          </p>
          <p className={styles.fadein}>Try it below.</p>
          <div className={styles.fadein + " " + styles.command}>
            {/* @ts-expect-error Server Component */}
            <Command />
          </div>
        </div>
      </div>
    </main>
  );
}

async function getBooks() {
  const res = await fetch("http://localhost:3001/api/books");
  const books = await res.json();
  return books;
}

async function Command() {
  const books = await getBooks();
  console.log(books);

  return <CommandMenu bookshelves={books} />;
}
