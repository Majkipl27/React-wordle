import { atom } from "jotai";

const wordsAtom = atom<string[]>([]);

const guessWordAtom = atom<string>("");

const lettersAtom = atom<string[][]>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
]);

const lettersWithSignaturesAtom = atom<string[]>([]);

const currentTryAtom = atom<number>(0);

export { wordsAtom, guessWordAtom, lettersAtom, lettersWithSignaturesAtom, currentTryAtom };