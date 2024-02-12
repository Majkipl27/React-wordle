import { atom } from "jotai";

const wordsAtom = atom<string[]>([]);
const guessWordAtom = atom<string>("");

export { wordsAtom, guessWordAtom };