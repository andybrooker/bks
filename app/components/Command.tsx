"use client";
import useDebounce from "@/hooks/useDebounce";
import { Command } from "cmdk";
import React from "react";
import { manrope } from "../fonts/fonts";
import styles from "./styles.module.css";

const bookshelves = {
  "To Read": [
    { id: 0, author: "Homer", title: "Iliad" },
    { id: 1, author: "Homer", title: "Odyssey" },
    { id: 2, author: "Harper Lee", title: "To Kill a Mockingbird" },
  ],
  Reading: [],
  Read: [],
};

type Bookshelves = {
  "To Read": Bookshelf[];
  Reading: Bookshelf[];
  Read: Bookshelf[];
};

type Bookshelf = {
  id: number;
  author: string;
  title: string;
};

export function CommandMenu({ bookshelves }: { bookshelves: Bookshelves }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = React.useState("");
  const [pages, setPages] = React.useState(["home"]);

  const activePage = pages[pages.length - 1];
  const atHome = activePage === "home";

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (atHome || inputValue.length) {
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setPages((pages) => {
          const oldPages = [...pages];
          oldPages.splice(-1, 1);
          return oldPages;
        });
      }
    },
    [inputValue.length, atHome]
  );

  const changeValue = (value: string) => setInputValue(value);

  return (
    <Command
      label="Command Menu"
      onKeyDown={onKeyDown}
      shouldFilter={activePage === "search" ? false : true}
    >
      {activePage === "search" ? (
        <Search value={inputValue} onValueChange={changeValue} />
      ) : (
        <>
          <Command.Input
            autoFocus
            ref={inputRef}
            className={manrope.className}
            value={inputValue}
            onValueChange={changeValue}
            placeholder="What do you want to do?"
          />
          <Command.List>
            {activePage === "home" && (
              <>
                <SearchBooksGroup />
                <BookshelvesGroup
                  navigateToPage={(page) => setPages([...pages, page])}
                />
              </>
            )}
            {activePage === "search" && (
              <>
                <Command.Group heading="Search Results"></Command.Group>
              </>
            )}
            {(activePage === "To Read" ||
              activePage === "Reading" ||
              activePage === "Read") && (
              <Command.Group heading={activePage}>
                <Command.Item onSelect={() => setPages([...pages, "search"])}>
                  <div className={styles.flex}>
                    <PlusIcon />
                    <span>Add New Book...</span>
                  </div>
                </Command.Item>

                {bookshelves[activePage].map((book, index) => (
                  <Command.Item
                    key={book.id + book.title}
                    value={book.id + book.title}
                  >
                    <div className={styles.flex}>
                      <BookIcon />
                      <span>{book.title}</span>
                      <span className={styles.secondary}>{book.author}</span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            <Command.Empty>No results found.</Command.Empty>
          </Command.List>
        </>
      )}
    </Command>
  );
}

type BookSearchResult = {
  key: string;
  title: string;
  author_name: string[];
};

function Search({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<BookSearchResult[]>([]);
  const debouncedValue = useDebounce(value, 500);

  React.useEffect(() => {
    async function getItems() {
      setLoading(true);
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${debouncedValue}&limit=10`
      );
      const results = await res.json();
      setResults(results.docs);
      setLoading(false);
    }

    if (!debouncedValue.length) {
      return;
    }

    getItems();
  }, [debouncedValue]);

  return (
    <>
      <Command.Input
        autoFocus
        ref={searchRef}
        className={manrope.className}
        value={value}
        onValueChange={onValueChange}
        placeholder="Search books..."
      />
      <Command.List>
        {loading && <Command.Loading>Fetching books…</Command.Loading>}
        {results.map((item) => {
          return (
            <Command.Item key={item.key} value={item.key}>
              <div className={styles.flex}>
                <BookIcon />
                <span>{item.title}</span>
                <span className={styles.secondary}>
                  {item?.author_name?.length
                    ? item.author_name.join(", ")
                    : "Unknown"}
                </span>
              </div>
            </Command.Item>
          );
        })}
      </Command.List>
    </>
  );
}

function SearchBooksGroup() {
  return (
    <>
      <Command.Group heading="Books">
        <Command.Item>Search books...</Command.Item>
        <Command.Item>Get recommendations...</Command.Item>
      </Command.Group>
    </>
  );
}

function BookshelvesGroup({
  navigateToPage,
}: {
  navigateToPage: (page: string) => void;
}) {
  const readingStatus = ["To Read", "Reading", "Read"];

  return (
    <>
      <Command.Group heading="My Library">
        {readingStatus.map((value) => (
          <Command.Item onSelect={() => navigateToPage(value)} key={value}>
            {value}
          </Command.Item>
        ))}
      </Command.Group>
    </>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M12 5.75V18.25"
      ></path>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M18.25 12L5.75 12"
      ></path>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M19.25 5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H14C12.8954 4.75 12 5.64543 12 6.75V19.25L12.8284 18.4216C13.5786 17.6714 14.596 17.25 15.6569 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V5.75Z"
      ></path>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H10C11.1046 4.75 12 5.64543 12 6.75V19.25L11.1716 18.4216C10.4214 17.6714 9.40401 17.25 8.34315 17.25H5.75C5.19772 17.25 4.75 16.8023 4.75 16.25V5.75Z"
      ></path>
    </svg>
  );
}
