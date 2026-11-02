import {
  createContext,
  useContext,
} from "react";

interface BookmarkContextValue {
  bookmarks: string[];
  onToggleBookmark: (
    evidenceId: string
  ) => void;
}

export const BookmarkContext =
  createContext<
    BookmarkContextValue | null
  >(null);

export function useBookmarks() {
  const context =
    useContext(BookmarkContext);

  if (!context) {
    throw new Error(
      "useBookmarks must be used inside BookmarkContext"
    );
  }

  return context;
}